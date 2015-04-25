var mongoose = require('mongoose');

module.exports = workspaceSchema = new mongoose.Schema({
    name: { type: String, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
});