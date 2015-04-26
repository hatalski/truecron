var mongoose           = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var task_types = 'default ftp http zip s3 file execute'.split(' ');

var taskSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: task_types, index: true },
    active: Boolean,
    settings: {},
    timeout: Number
});

var scheduleSchema = new mongoose.Schema({
    dtStart: Date,
    dtEnd: Date,
    rrule: String,
    exrule: String,
    rdate: String,
    exdate: String
});

var jobSchema = new mongoose.Schema({
    name: { type: String, index: true },
    active: String,
    archived: { type: Boolean },
    schedules: [scheduleSchema],
    tags: [String],
    tasks: [taskSchema],
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }
});

jobSchema.plugin(creationInfoPlugin);

module.exports = mongoose.model('Job', jobSchema);