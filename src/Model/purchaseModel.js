const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    purchaseDate: { type: Date },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('purchase', purchaseHistorySchema);