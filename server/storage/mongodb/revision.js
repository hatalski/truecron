var mongoose = require('mongoose');

module.exports = revisionSchema = new mongoose.Schema({
    change: {},
    oldValue: {},
    operation: String,
    entity: String,
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
});