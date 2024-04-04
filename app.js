var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ordersCronJob = require('./cronjobs/orders');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminsRouter = require('./routes/admins');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://huzaifadar:'+ process.env.MONGO_ATLAS_DB_PWD +'@cluster0.9sf9tqo.mongodb.net/') // mongodb+srv://huzaifadar:<password>@cluster0.9sf9tqo.mongodb.net/
ordersCronJob.resetOrders();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept, Authorization");
  if(req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Headers',"PUT, POST, PATCH, DELETE");
    return res.status(200).json({})
  }
  next();
}); // middleware for json parse.

app.use('/', indexRouter); // open middleware
app.use('/users', usersRouter); // employees and staff.
app.use('/admins', adminsRouter); // admins and managers.
app.use('/products', productsRouter); // products.
app.use('/orders', ordersRouter); // orders.

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
