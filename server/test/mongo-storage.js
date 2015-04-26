var mongoose   = require('mongoose');
var mongodb    = require('../lib/mongodb');
var schema     = require('../storage/mongodb/schema');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var mongoData  = require('./data/mongo');

describe.only('Mongo Storage',
    function() {
        "use strict";
        before(function (done) {
            mongoData.init(function (err) {
                if (err) done(err);
            });
        });

        it('first test', function(done) {
           done();
        });
    });