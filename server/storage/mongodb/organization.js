var mongoose = require('mongoose');

var role_enum = 'admin viewer member'.split(' ');

var userRoleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: role_enum }
});

module.exports = organizationSchema = new mongoose.Schema({
    name: { type: String, index: true },
    email: String,
    avatarUrl: String,
    plan: {},
    secretHash: String,
    users: [userRoleSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});