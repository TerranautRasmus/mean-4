var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../model/userSchema');

router.post('/signup', function(req, res) {
    console.log(req.body.userName + " - " + req.body.password);

    if (!req.body.userName || !req.body.password) {
        res.json({success: false, msg: 'Please enter username and password.'});
    } else {
        var newUser = new User({
            userName: req.body.userName,
            password: req.body.password
        });
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});


module.exports = router;
