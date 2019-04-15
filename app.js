var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const exphbs = require('express-hbs');
require('dotenv').config();
var indexRouter = require('./routes/index');
var bookMangerRouter = require('./routes/bookManger');

var app = express();

var models = require('./models');

// Sync Database
models.sequelize.sync().then(function (res) {
  console.log('Db connected and synchronized');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
require('./lib/handlebarHelpers')
  .helpers(exphbs);

app.engine(
  'hbs',
  exphbs.express4({
    extname: '.hbs',
    defaultLayout: __dirname + '/views/layouts/default.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
  })
);
app.set('view engine', 'hbs');
app.set('models', models)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/library', bookMangerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
