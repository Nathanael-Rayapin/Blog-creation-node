var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Article = require('./models/article.model');
const Category = require('./models/category.model');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require('mongoose');
mongoose
  .connect(
    "mongodb+srv://Nathanael:Pdxa3P3VTw6dLxCr@cluster0.owdml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

for (let index = 0; index < 8; index++) {
  const article = new Article({
    title: "Qu\'est-ce que le Lorem Ipsum?",
    content: "Le Lorem Ipsum est simplement du faux texte",
    publishedAt: Date.now()
  })

  // article.save()
  //   .then(() => console.log("Sauvegarde réussie"))
  //   .catch(() => console.log("Sauvegarde échoué"));
}

for (let index = 0; index < 8; index++) {
  const category = new Category({
    title: "Qu\'est-ce que le Lorem Ipsum?",
    description: "Le Lorem Ipsum est simplement du faux texte",
  })

  // category.save()
  //   .then(() => console.log("Sauvegarde réussie"))
  //   .catch(() => console.log("Sauvegarde échoué"));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
