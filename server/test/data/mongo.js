var mongoose   = require('mongoose');
var models     = require('../../storage/mongodb/schema');
var Promise    = require('bluebird');

var User = models.User;
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

var Organization = models.Organization;
Promise.promisifyAll(Organization);
Promise.promisifyAll(Organization.prototype);

module.exports.init = function(done) {
    "use strict";
    var truecronUser = new User({
        emails: [{
            email: 'vh@truecron.com',
            status: 'active',
            verified: true
        }, {
            email: 'vhatalski@naviam.com',
            status: 'active',
            verified: true
        }],
        name: 'Vitali Hatalski',
        passwordHash: '',
        avatarUrl: '',
        organizations: []
    });
    truecronUser.save().exec(function(user) {
        var perOrgTruecronUser = new Organization({
            name: 'Personal',
            users: [{
                user: truecronUser,
                role: 'admin'
            }]
        });
        return perOrgTruecronUser.save().exec();
    }).then(function(perOrg) {
        truecronUser.organizations.push(perOrg);
        var corpOrgTruecronUser = new Organization({
            name: 'TrueCron',
            users: [{
                user: truecronUser,
                role: 'admin'
            }]
        });
        return corpOrgTruecronUser.save().exec();
    }).then(function(corpOrg) {
        truecronUser.organizations.push(corpOrg);
        return truecronUser.save().exec();
    }).then(function(user) {
        done(user);
    });
};