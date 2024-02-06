const mongoose = require('mongoose');
const userModel = require('../Model/userModel');
const bookModel = require('../Model/bookModel');
const generateSlug = require('./slugFunction');
const nodemailer = require('nodemailer');

const createBook = async (req, res) => {
    try {
        const { authors, title, description, price } = req.body;
        if (!authors || authors.length === 0) {
            return res.status(400).send({ status: false, error: 'atleast one author required' });
        }
        const authorIds = authors;
        let notvalidId = [];
        for (const authorId of authorIds) {
            if (!mongoose.Types.ObjectId.isValid(authorId)) {
                notvalidId.push(authorId);
            }
        }
        if (notvalidId.length > 0) { return res.status(400).send({ status: false, error: 'these author id not valid :' + notvalidId }); }
        if (!authorIds.includes(req.userId)) { return res.status(401).send({ status: false, error: 'not authorised ' }); }

        let notFoundAuthor = [];
        for (const authorId of authorIds) {
            const author = await userModel.findOne({ _id: authorId, role: 'author', isDeleted: false });
            if (!author) {
                notFoundAuthor.push(authorId);
            }
        }
        if (notFoundAuthor.length > 0) { return res.status(400).send({ status: false, error: 'these author id not exist :' + notFoundAuthor }); }
        if (!title) {
            return res.status(400).send({ status: false, error: 'title is required' });
        }
        if (!description) {
            return res.status(400).send({ status: false, error: 'description is required' });
        }
        if (!price || typeof (price) !== 'number') {
            return res.status(400).send({ status: false, error: 'price is required and should be number' });
        }
        if (price < 100 || price > 1000) {
            return res.status(400).send({ status: false, error: 'price should be 100-1000' });
        }
        if (!req.body.ISBN) {
            return res.status(400).send({ status: false, message: "Please provide ISBN" });
        }
        //ISBN format validation
        const ISBNRgx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(
            req.body.ISBN
        );
        if (!ISBNRgx) {
            return res.status(400).send({ status: false, message: "Please provide valid ISBN format" });
        }
        const slug = generateSlug.generateSlug(title);
        const existingBook = await bookModel.findOne({ title: slug });
        if (existingBook) {
            return res.status(400).send({ status: false, error: 'book title already exists' });
        }
        let checkISBN = await bookModel.findOne({ ISBN: req.body.ISBN });
        if (checkISBN) {
            return res.status(400).send({
                status: false,
                message: `${req.body.ISBN} already exist use different ISBN`,
            });
        }

        const book = {
            authors: authors,
            title: slug.trim(),
            description: description.trim(),
            price: price,
            ISBN: req.body.ISBN.trim()
        };
        const createdBook = await bookModel.create(book);
        let Alluser = await userModel.find();
       let to=["rkrahulkv143@gmail.com"];
       Alluser.forEach((ele)=>{
        if(ele.role=='retailuser'){
        to.push(ele.email)
        }
       })
       let subject="new book realeased";
       let text=`check out our new realeased book ${title}`
        await sendEmailNotification(to,subject,text);
        return res.status(201).send({ status: true, message: "book created successfully", data: createdBook });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
const sendEmailNotification = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false
        });
        

        await transporter.sendMail({
            from: 'your-email@example.com', // Sender email address
            to: to, // Recipient email address
            subject: subject, // Email subject
            text: text // Email body
        });

        console.log('Email notification sent successfully.');
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const filterBooks = async (req, res) => {
    try {
        const { authorId, priceMin, priceMax, title, bookId, ISBN } = req.query;
        const filter = { isDeleted: false };
        if (authorId) filter.authors = authorId;
        if (title) filter.title = new RegExp(title, 'i');
        if (bookId) filter._id = bookId;
        if (ISBN) filter.ISBN = ISBN;

        if (priceMin && priceMax) {
            filter.price = { $gte: priceMin, $lte: priceMax };
        } else if (priceMin) {
            filter.price = { $gte: priceMin };
        } else if (priceMax) {
            filter.price = { $lte: priceMax };
        }

        const books = await bookModel.find(filter);
        if (books.length == 0) { return res.status(404).send({ status: false, error: 'no book found with your searching criteria' }); }

        return res.status(200).send({ status: true, data: books });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: err.message });
    }
};


const searchBooks = async (req, res) => {
    try {
        const { authorId, priceMin, priceMax, title, bookId, ISBN } = req.query;
        const filter = { isDeleted: false };

        const orConditions = [];

        if (authorId) orConditions.push({ authors: authorId });
        if (title) orConditions.push({ title: new RegExp(title, 'i') });
        if (bookId) orConditions.push({ _id: bookId });
        if (ISBN) orConditions.push({ ISBN: ISBN });

        if (priceMin !== undefined && priceMax !== undefined) {
            orConditions.push({ price: { $gte: priceMin, $lte: priceMax } });
        } else if (priceMin !== undefined) {
            orConditions.push({ price: { $gte: priceMin } });
        } else if (priceMax !== undefined) {
            orConditions.push({ price: { $lte: priceMax } });
        }

        if (orConditions.length === 0) {
            return res.status(400).send({ status: false, error: 'Please provide at least one search criteria' });
        }

        filter.$or = orConditions;

        const books = await bookModel.find(filter);

        if (books.length === 0) {
            return res.status(404).send({ status: false, error: 'No books found with your search criteria' });
        }

       return res.status(200).send({ status: true, data: books });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: error.message });
    }
};




module.exports = { createBook, filterBooks,searchBooks };