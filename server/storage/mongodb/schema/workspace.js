var mongoose = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var workspaceSchema = new mongoose.Schema({
    name: { type: String, index: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
});

workspaceSchema.plugin(creationInfoPlugin);

module.exports = mongoose.model('Workspace', workspaceSchema);