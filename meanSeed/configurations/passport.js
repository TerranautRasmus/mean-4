var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jwt-simple');
var User = require('../model/userSchema');
var jwtConfig = require('../configurations/jwtConfig').jwtConfig;

module.exports = function(passport) {

    var opts = {};
    opts.secretOrKey = jwtConfig.secret;
    opts.issuer = jwtConfig.issuer;
    opts.audience = jwtConfig.audience;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("PAYLOAD: " + jwt_payload);

        User.findOne({userName: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false, "User and token not found");
            }
        });
    }));

    passport.use(new FacebookStrategy({
            clientID: "600121516807390",
            clientSecret: "57247e652342f4a35717b8a0476500af",
            callbackURL: 'http://localhost:3000/api/auth/login/facebook/return',
            profileFields: ['id', 'email', 'birthday', 'displayName', 'friends']
        },
        function(accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }));


    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });

};