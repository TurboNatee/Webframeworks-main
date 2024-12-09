var createError = require('http-errors');
var express = require('express');
var path = require('path');
const User = require('./app_api/Models/user');
const Product = require('./app_api/Models/Schema');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./app_api/Models/db.js');
var indexRouter = require('./app_server/routes/index');
var apiRouter = require('./app_api/routes/index');
var app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const argon2 = require('argon2');
const allowedOrigins = ['http://localhost:4200', 'https://localhost'];
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('./sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(8000);
httpsServer.listen(443);
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key', // Replace with a stronger key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');
const cors = require('cors');

app.use(cors({
  origin: function(origin, callback) {
      callback(null, true);

  },
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}));

app.use('/api', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public')));

app.get('/', (req, res) => {
  res.redirect('/Homepage');
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/Login');
}

app.get('/Homepage', isAuthenticated, (req, res) => {
  res.render('Homepage', {
    title: 'Homepage',
    navbar: getNavbar(req),
  });
});

module.exports = app;
