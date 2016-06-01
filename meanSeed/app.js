var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportConfig = require('./configurations/passport');
passportConfig(passport);

var helmet = require('helmet');
var session = require('cookie-session');

var routes = require('./routes/index');
var testApi = require('./routes/testapi');
var userApi = require('./routes/userApi');
var authApi = require('./routes/authApi');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helmet());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    if ( req.headers['x-forwarded-proto'] === 'http' ) {
        var tmp= 'https://'+req.headers.host+req.originalUrl;
        res.redirect(tmp);

    } else {
        return next();
    }
});

app.set('trust proxy', 1);
app.use(session({
        secret: 'secretsecret',
        name: 'cookie_seed'
    })
);

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1hour
app.use(session({
        name: 'session',
        keys: ['key1', 'key2'],
        cookie: {
            secure: true, //Ensures the browser only sends the cookie over HTTPS.
            httpOnly: true, //Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
            domain: 'example.com', //indicates the domain of the cookie
            path: 'foo/bar', //indicates the path of the cookie
            expires: expiryDate //use to set expiration date for persistent cookies.
        }
    })
);

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(path.join(__dirname, 'public/app')));

var db = require('./configurations/mongoose');


//Redirection to index.html
app.use('/', routes);

app.use('/api/user', userApi);
app.use('/api/auth', authApi);

app.use('/api', function (req, res, next) {
    passport.authenticate('jwt', {session: false}, function (err, user, info) {
        if (err) {
            res.status(403).json({msg: "Token could not be authenticated", fullError: err});
        }
        if (user) {
            return next();
        }
        return res.status(403).json({msg: "Token could not be authenticated", fullError: info});
    })(req, res, next);
});
app.use('/api', testApi);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
