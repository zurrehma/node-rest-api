const express = require('express');
const morgan = require('morgan');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//morgan used for logging purpose
app.use(morgan('dev'));
//routes which will handle incoming requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(function(req, res, next) {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports= app;