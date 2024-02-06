const mongoose = require('mongoose');


const revenueSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'book', required: true },
    revenue: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: String, trim: true },
},{timestamps:true});

module.exports = mongoose.model('revenue', revenueSchema);
