var mongoose = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var emailSchema = new mongoose.Schema({
    email: String,
    status: String,
    verified: Boolean
});

var userSchema = new mongoose.Schema({
    emails: [emailSchema],
    name: { type: String, index: true },
    passwordHash: String,
    avatarUrl: { type: String },
    extensionData: {},
    deleted: { type: Boolean, 'default': false },
    lastLoginAt: { type: Date },
    organizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }]
});

userSchema.plugin(creationInfoPlugin);

module.exports = mongoose.model('User', userSchema);