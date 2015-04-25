var mongoose = require('mongoose');

var emailSchema = new mongoose.Schema({
    email: String,
    status: Boolean,
    verified: Boolean
});

module.exports = userSchema = new mongoose.Schema({
    emails: [emailSchema],
    name: { type: String, index: true },
    passwordHash: String,
    avatarUrl: { type: String },
    extensionData: {},
    deleted: { type: Boolean },
    lastLoginAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }]
});