/**
 * Created by vitalihatalski on 10/18/14.
 */
var nodemailer    = require('nodemailer');
var sesTransport  = require('nodemailer-ses-transport');
var config        = require('./config');

var transport = nodemailer.createTransport(sesTransport({
    //endpoint: 'email-smtp.us-east-1.amazonaws.com',

    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
    rateLimit: 5 // it's our current limit: http://docs.aws.amazon.com/ses/latest/DeveloperGuide/limits.html
}));

module.exports = transport;