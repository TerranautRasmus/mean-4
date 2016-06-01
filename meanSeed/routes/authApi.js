var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var User = require('../model/userSchema');
var passport = require('passport');

const jwtConfig = require('../configurations/jwtConfig').jwtConfig;

router.post('/authenticate', function (req, res) {
    User.findOne({userName: req.body.userName}, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {

                    var iat = new Date().getTime() / 1000;

                    var exp = iat + jwtConfig.tokenExpirationTime;

                    var payload = {
                        aud: jwtConfig.audience,
                        iss: jwtConfig.issuer,
                        iat: iat,
                        exp: exp,
                        sub: user.userName
                    };

                    var token = jwt.encode(payload, jwtConfig.secret);
                    res.json({token: 'JWT ' + token});

                } else {
                    res.status(401).send({msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });


});

//localhost:3000/api/auth/login/facebook
router.get('/login/facebook', passport.authenticate('facebook', {scope: 'public_profile,email,user_friends,user_birthday'})); //her sættes ind hvad man ønsker retur.

router.get('/login/facebook/return',
    passport.authenticate('facebook'),
    function (req, res) {
        console.log("in facebook return!");
        console.log(res);
    });

module.exports = router;
