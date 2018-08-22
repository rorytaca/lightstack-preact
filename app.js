require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const hbsHelpers = require('./utils/hbs-helpers');

const globalData = require('./utils/global-data.js');
const index = require('./routes/index');
const airtable = require('./routes/airtable');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// setup partials
hbsutils.registerPartials(__dirname + '/views/partials');
hbsutils.registerWatchedPartials(__dirname + '/views/partials');

// setup components
hbsutils.registerPartials(__dirname + '/views/components');
hbsutils.registerWatchedPartials(__dirname + '/views/components');

// setup hbs helpers
hbs.registerHelper(hbsHelpers);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


//api routes before global data
app.use('/airtable', airtable);
//global data
app.use('/', globalData);
//content routes after global data
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
