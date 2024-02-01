const mongoose = require('mongoose');
const bookModel = require('../Model/bookModel');
const userModel = require('../Model/userModel');
const purchaseModel = require('../Model/purchaseModel');

const createPurchaseHistory = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) { return res.status(400).send({ status: false, error: "missing/invalid parameters" }); }

        const { bookId, price, quantity } = req.body;
        const userId = req.params.userId.toString();

        if (!bookId) { return res.status(400).send({ status: false, error: "missing/invalid parameter bookId" }); }
        if (!quantity || typeof (quantity) !== 'number' || quantity <= 0) {
            return res.status(400).send({ status: false, error: 'quantity is required and should be number and greater than 0' });
        }
        if (!price || typeof (price) !== 'number') {
            return res.status(400).send({ status: false, error: 'price is required and should be number' });
        }
        if (!quantity || typeof (quantity) !== 'number' || quantity<=0) { return res.status(400).send({ status: false, error: "missing/invalid parameter quantity, should be number and greater than 0" }); }
        if (!userId) { return res.status(400).send({ status: false, error: "missing/invalid parameter userId" }); }
        if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(400).send({ status: false, error: "missing/invalid parameter userId" }); }
        if (!mongoose.Types.ObjectId.isValid(bookId)) { return res.status(400).send({ status: false, error: "missing/invalid parameter bookId" }); }

        const user = await userModel.findById(userId);
        if (!user || user.role !== 'retailUser') {
            return res.status(403).send({ status: false, error: "unauthorized: only retail users can make purchases" });
        }

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).send({ status: false, error: "book not found" });
        }
        book.sellCount += quantity;
        await book.save();

        const purchase = {
            bookId: bookId,
            userId: userId,
            purchaseDate: new Date(),
            price: price,
            quantity: quantity
        };

        const savedPurchase = await purchaseModel.create(purchase);
        return res.status(201).send({ status: true, message: "purchase history created successfully", data: savedPurchase });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createPurchaseHistory };
