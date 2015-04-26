var mongoose = require('mongoose');
var creationInfoPlugin = require('./creationInfoPlugin');

var role_enum = 'admin viewer member'.split(' ');

var userRoleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: role_enum }
});

var organizationSchema = new mongoose.Schema({
    name: { type: String, index: true },
    email: String,
    avatarUrl: String,
    plan: {},
    secretHash: String,
    users: [userRoleSchema]
});

organizationSchema.plugin(creationInfoPlugin);

module.exports = mongoose.model('Organization', organizationSchema);