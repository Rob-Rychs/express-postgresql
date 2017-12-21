'use strict';
/**
 * Module dependencies.
 */
// toobusy for handling server load
// var toobusy = require('toobusy-js');
var express = require('express');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var multer = require('multer');
var ejsEngine = require('ejs-mate');
var Promise = require('bluebird');
// can use MySQLStore instead of postgresSQL
//var MySQLStore = require('connect-mysql')({ session: session });
var flash = require('express-flash');
var path = require('path');
var passport = require('passport');
var expressValidator = require('express-validator');
var expressStatusMonitor = require('express-status-monitor'); // added this not installed yet
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var blogController = require('./controllers/blog');
// var apiController = require('./controllers/api');
// var contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/* Avoid not responsing when server load is huge - uses toobusy-js */
// app.use(function(req, res, next) {
//   if (toobusy()) {
//     res.status(503).send("I'm busy right now, sorry. Please try again later.");
//   } else {
//     next();
//   }
// });

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.engine('ejs', ejsEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
app.use(expressStatusMonitor()); // added this to monitor server
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'uploads') }).single());
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

Promise.longStackTraces();

var db = require('./models/sequelize');

// MySQL Store
/*
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MySQLStore({
    config: secrets.mysql,
    table: secrets.mysql.sessionTable
  })
}));
*/
//PostgreSQL Store
app.use(session({
  store: new pgSession({
    conString: secrets.postgres,
    tableName: secrets.sessionTable
  }),
  secret: secrets.sessionSecret,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days 
    httpOnly: true
    //, secure: true // only when on HTTPS
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: { angular: true },
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.gaCode = secrets.googleAnalyticsCode;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', res.locals._csrf, {httpOnly: false});
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

app.get('/posts', blogController.getBlogs);
app.get('/post/:id', blogController.getBlogPost)
app.get('/posts/submit', blogController.getBlogSubmit);
app.post('/posts/submit', blogController.postBlogSubmit);

app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.delete('/account', passportConf.isAuthenticated, userController.deleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

function safeRedirectToReturnTo(req, res) {
  var returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
}

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/github', passport.authenticate('github', secrets.github.authOptions));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/google', passport.authenticate('google', secrets.google.authOptions));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/twitter', passport.authenticate('twitter', secrets.twitter.authOptions));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/linkedin', passport.authenticate('linkedin', secrets.linkedin.authOptions));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */

db
  .sequelize
  .sync({ force: false })
  .then(function() {
      app.listen(app.get('port'), function() {
        console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
      });
  });

module.exports = app;
