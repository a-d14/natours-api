// ONLY USE THIS TO CONFIGURE EXPERSS

const express = require('express');
const morgan = require('morgan'); // middleware that gived info about request

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());

if(process.env.DOT_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`)); // used to serve static files
 
// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    req.reqTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

