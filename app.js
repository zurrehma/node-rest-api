const express = require('express');
const morgan = require('morgan');
const body = require('body-parser');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//morgan used for logging purpose
app.use(morgan('dev'));
app.use(body.urlencoded({ extended: false }));
app.use(body.json({}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});
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