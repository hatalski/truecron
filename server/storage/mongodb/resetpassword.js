var mongoose = require('mongoose');

module.exports = resetPasswordSchema = new mongoose.Schema({
    email: { type: String, index: true },
    code: String,
    createdAt: { type: Date, default: Date.now }
});