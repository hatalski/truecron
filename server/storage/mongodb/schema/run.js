var mongoose = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var run_status = 'succeeded failed running'.split(' ');

var output = new mongoose.Schema({
    logUrl: String,
    message: String
});

var runSchema = new mongoose.Schema({
    status: { type: String, enum: run_status},
    duration: Number,
    message: String,
    taskOutputs: [output],
    startedAt: { type: Date, default: Date.now },
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
});

module.exports = mongoose.model('Run', runSchema);