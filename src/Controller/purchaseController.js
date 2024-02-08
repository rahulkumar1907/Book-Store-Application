const mongoose = require('mongoose');
const bookModel = require('../Model/bookModel');
const userModel = require('../Model/userModel');
const purchaseModel = require('../Model/purchaseModel');
const revenueModel = require('../Model/revenueModel');

const createPurchaseHistory = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, error: "missing/invalid parameters" });
        }

        const { bookId, quantity } = req.body;
        const userId = req.userId.toString();

        if (!bookId) {
            return res.status(400).send({ status: false, error: "missing/invalid parameter bookId" });
        }
        if (!quantity || typeof (quantity) !== 'number' || quantity <= 0) {
            return res.status(400).send({ status: false, error: 'quantity is required and should be number and greater than 0' });
        }
        if (!quantity || typeof (quantity) !== 'number' || quantity <= 0) {
            return res.status(400).send({ status: false, error: "missing/invalid parameter quantity, should be number and greater than 0" });
        }
        if (!userId) {
            return res.status(400).send({ status: false, error: "missing/invalid parameter userId" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, error: "missing/invalid parameter userId" });
        }
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, error: "missing/invalid parameter bookId" });
        }

        const user = await userModel.findById(userId);
        if (!user || user.role !== 'retailuser') {
            return res.status(403).send({ status: false, error: "unauthorized: only retail users can make purchases" });
        }

        const book = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, error: "book not found" });
        }
        book.sellCount += quantity;
        await book.save();

        const purchase = {
            bookId: bookId,
            userId: userId,
            purchaseDate: new Date(),
            price: book.price * quantity,
            quantity: quantity
        };

        const savedPurchase = await purchaseModel.create(purchase);

        for (const authorId of book.authors) {
            await revenueModel.findOneAndUpdate(
                { authorId: authorId, bookId: book._id, isDeleted: false },
                { $inc: { revenue: book.price * quantity } },
                { upsert: true }
            );
        }

        return res.status(201).send({ status: true, message: "purchase history created successfully", data: savedPurchase });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

const getPurchaseHistoryByUser = async (req, res) => {
    try {
        const purchaseId = req.params.purchaseId;
        if (!purchaseId) { return res.status(400).send({ status: false, error: "missing/invalid parameter purchaseId" }); }
        if (!mongoose.Types.ObjectId.isValid(purchaseId)) { return res.status(400).send({ status: false, error: "missing/invalid parameter purchaseId" }); }
        console.log("req.userId", req.userId);
        const purchaseHistory = await purchaseModel.find({ _id: purchaseId, userId: req.userId.toString(), isDeleted: false }).select({ __v: 0, userId: 0 });
        if (purchaseHistory.length === 0) { return res.status(404).send({ status: false, error: "no record found" }); }
        return res.status(200).json({ status: true, data: purchaseHistory });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
};

const getRevenueForAuthor = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("req.userId", req.userId);
        if (userId != req.userId) { return res.status(401).send({ status: false, error: "user not authorised" }); }

        if (!userId) { return res.status(400).send({ status: false, error: "missing/invalid parameter userId" }); }
        if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(400).send({ status: false, error: "missing/invalid parameter userId" }); }

        const revenueHistory = await revenueModel.find({ authorId: userId, isDeleted: false }).select({ __v: 0 });
        if (revenueHistory.length === 0) { return res.status(404).send({ status: false, error: "no record found" }); }
        let totalRevenue = 0;
        revenueHistory.forEach((el) => {
            totalRevenue += el.revenue;
        });
        let response = {
            authorId: userId,
            totalRevenue: totalRevenue
        };
        return res.status(200).json({ status: true, data: response });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
};

module.exports = { createPurchaseHistory, getPurchaseHistoryByUser, getRevenueForAuthor };
