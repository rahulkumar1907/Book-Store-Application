const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
    {
        bookId: { type: ObjectId, ref: "books", trim: true },
        reviewedBy: { type: String, default: "Guest", trim: true },
        reviewedAt: { type: Date, default: Date, trim: true },
        rating: { type: Number, required: true, trim: true },
        review: { type: String, trim: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);