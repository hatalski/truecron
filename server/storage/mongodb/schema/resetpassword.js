var mongoose = require('mongoose');

var resetPasswordSchema = new mongoose.Schema({
    email: { type: String, index: true },
    code: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResetPassword', resetPasswordSchema);