var mongoose = require('mongoose');

mongoose.model('User', require('./user'));
mongoose.model('Organization', require('./organization'));
mongoose.model('Workspace', require('./workspace'));
mongoose.model('Job', require('./job'));
mongoose.model('Revision', require('./revision'));
mongoose.model('Connection', require('./connection'));
mongoose.model('Run', require('./run'));
mongoose.model('ResetPassword', require('./resetpassword'));