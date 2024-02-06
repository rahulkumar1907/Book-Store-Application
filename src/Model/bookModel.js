const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    sellCount: { type: Number, default: 0 },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    ISBN: { type: String,required: true, trim: true },
    reviews: { type: Number, default: 0, trim: true },
    price: { type: Number, required: true, min: 100, max: 1000 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: String, trim: true },
},{timestamps:true});

module.exports = mongoose.model('book', bookSchema);
