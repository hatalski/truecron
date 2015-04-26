var mongoose = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var revisionSchema = new mongoose.Schema({
    change: {},
    oldValue: {},
    operation: String,
    entity: String,
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
});

revisionSchema.plugin(creationInfoPlugin);

module.exports = mongoose.model('Revision', revisionSchema);