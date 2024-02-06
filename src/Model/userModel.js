const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['author', 'admin', 'retailuser'], required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);