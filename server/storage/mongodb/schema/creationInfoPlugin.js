/*
* Mongoose plugin to insert creation info into schema.
* */
var mongoose = require('mongoose');

module.exports = exports = function creationInfoPlugin(schema, options) {
    "use strict";
    schema.add({ createdAt: { type: Date, default: Date.now } });
    schema.add({ updatedAt: { type: Date }});
    schema.add({
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    });
};