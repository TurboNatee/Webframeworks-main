var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
const User = require('./app_api/Models/user');  // Ensure User model is correctly imported
const Product = require('./app_api/Models/Schema');  // Ensure products model is imported
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./app_api/Models/db.js');  // Ensure DB connection is established
var indexRouter = require('./app_server/routes/index');
var apiRouter = require('./app_api/routes/index');  // Import your API routes
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
var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(8000);
httpsServer.listen(443);

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');
const cors = require('cors');

// Allow CORS from your Angular frontend
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy does not allow this origin'), false);
    }
  },
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,  // Allow credentials (cookies, sessions)
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

// Redirect to homepage on root access
app.get('/', (req, res) => {
  res.redirect('/Homepage');
});

// Body parser for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }  // Set to true if you're using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
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

// Serialize user info into session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user info from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/Login');  // Redirect to login page if not authenticated
}

// Route for homepage (requires authentication)
app.get('/Homepage', isAuthenticated, (req, res) => {
  res.render('Homepage', {
    title: 'Homepage',
    navbar: getNavbar(),
  });
});

module.exports = app;
