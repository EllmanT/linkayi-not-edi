var createError = require('http-errors');
var express = require('express');
const cors = require('cors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docsAiRouter = require('./routes/docsAi')
var clientsRouter = require('./routes/clients')
var app = express();

// gitview engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = ['http://localhost:4200', 'https://yourfrontenddomain.com', 'https://gcp-certification-pxdyos.web.app', 'http://140.82.25.196:10069'];
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the allowed list or if it's undefined (no origin, like curl requests, mobile apps, etc.)
   // if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    //} else {
    //  callback(new Error('Not allowed by CORS'));
    //}
  },
}));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docsAi', docsAiRouter)
app.use('/clients', clientsRouter);

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
