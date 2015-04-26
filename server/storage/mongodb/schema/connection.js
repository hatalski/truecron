var mongoose = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var connection_types = 'ftp http zip s3 file execute'.split(' ');

var connectionSchema = new mongoose.Schema({
    name: { type: String, index: true },
    type: { type: String, enum: connection_types },
    settings: {},
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }
});

connectionSchema.plugin(creationInfoPlugin);

module.exports = mongoose.model('Connection', connectionSchema);