/**
 * Created by vitalihatalski on 10/18/14.
 */
var express = require('express');
var path = require('path');
var router = express.Router();

router.post('/signup', function(req, res) {
    var email = req.body.email;

    // send welcome email to beta user

    // send beta user's email to Vitali and Lev

    res.status(201).json({});
});

module.exports = router;