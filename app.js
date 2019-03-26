const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// require routes to be used
const indexRouter = require('./routes');
const booksRouter = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/books', booksRouter);

// error handlers
app.use((req, res, next) => {
	const error = new Error('Page Not Found - 404');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.locals.error = error;
	res.render('page-not-found', {error});
})

module.exports = app;
