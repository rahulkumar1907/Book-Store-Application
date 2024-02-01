const userModel = require('../Model/userModel');
const bookModel = require('../Model/bookModel');
const generateSlug=require('./slugFunction');


const createBook = async (req, res) => {
    try {
        const { authors, title, description, price } = req.body;
        if (!authors || authors.length === 0) {
            return res.status(400).send({ status: false, error: 'atleast one author required' });
        }

        // Check if any of the author IDs are not valid authors
        const authorIds = authors;
        let notFoundAuthor = [];
        for (const authorId of authorIds) {
            const author = await userModel.findOne({ _id: authorId, role: 'author' });
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
        const slug = generateSlug.generateSlug(title);
        const existingBook = await bookModel.findOne({ title: slug });
        if (existingBook) {
            return res.status(400).send({ status: false, error: 'book title already exists' });
        }

        const book = {
            authors: authors,
            title: slug.trim(),
            description: description.trim(),
            price: price
        };
        const createdBook = await bookModel.create(book);
        return res.status(201).send({ status: true, message: "book created successfully", data: createdBook });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};


module.exports = { createBook };