/**
 * Created by vitali hatalski on 10/18/14.
 */
var express  = require('express');
var path     = require('path');
var smtp     = require('../lib/smtp');
var router   = express.Router();
var validator = require('validator');

router.post('/signup', function(req, res) {
    var email = req.body.email;
    var validEmail = validator.isEmail(email);

    console.log('email:'+email);
    console.log('TEST-'+req.body.test);

    if (req.body.test) {
        if (validEmail){
            res.status(201).json({ message: 'Thanks for signing up! Share this page to spread the word!'});
        }
        else {
            res.status(400).json({ message: 'You do not signing up. Email not valid!!!'});
        }
        return;
    }
    if (validEmail) {
        // send welcome email to beta user
        smtp.sendMail({
            from: 'welcome@truecron.com',
            to: email,
            subject: 'Thanks from TrueCron team, stay tuned!',
            html: 'Thank you for signing up for TrueCron!<br/><br/>' +
                'You can really help us out by sharing with your friends:<br/><br/>' +
                '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.truecron.com" data-text="TrueCron: Enterprise Strength Scheduling" data-via="TrueCron">Tweet</a>' +
                '<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document, "script", "twitter-wjs");</script>' +
                '<br/><br/>Yours Truly,<br/>' +
                'TrueCron Team'
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.dir(info);
                console.log('Message sent: ' + info.messageId);
            }
        });

        // send beta user's email to Vitali and Lev
        smtp.sendMail({
            from: 'welcome@truecron.com',
            to: 'vitali.hatalski@truecron.com,lev.kurts@truecron.com',
            subject: 'Hooray!!!',
            html: '<h1>Hooray!!!</h1><p>' + email + ' signed up for beta!</p><br/><br/>' +
                '<img src="http://n1s2.hsmedia.ru/2a/c3/0b/2ac30b53009aaf56d23d3beceecc68cb/350x521_0_b6625407491fd0b926477bf94d7db3b9@350x521_0xc0a8393c_2239884761370475119.jpg" alt="champagne" /><br/><br/>' +
                'P.S. Do not fuck up! :)<br/>'
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.dir(info);
                console.log('Message sent: ' + info.messageId);
            }
        });

        res.status(201).json({ message: 'Thanks for signing up! Share this page to spread the word!'});
    }
    else {
        res.json({ message: 'You do not signing up. Email not valid!!!'});
        res.status(400);
    }
});


module.exports = router;