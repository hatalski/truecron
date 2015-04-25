var mongoose = require('mongoose');

var connection_types = 'ftp http zip s3 file execute'.split(' ');

module.exports = connectionSchema = new mongoose.Schema({
    name: { type: String, index: true },
    type: { type: String, enum: connection_types },
    settings: {},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }
});