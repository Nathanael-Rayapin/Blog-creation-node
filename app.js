var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
const flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User = require('./models/user.model');
const Article = require('./models/article.model');
const dotenv = require('dotenv').config();

var app = express();
// Prise en charge du JSON
app.use(bodyParser.json());
// Prise en charge des formulaires HTML
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));


mongoose
  .connect(
    process.env.DATABASE
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Init flash
app.use(flash());

// Init Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    Article.find({ author: req.user._id }, (err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.articles = articles;
      }
      next();
    })
  } else {
    next();
  }
})

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.warning = req.flash('warning');
  res.locals.success = req.flash('success');
  res.locals.errorForm = req.flash('errorForm');
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
