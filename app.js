const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import por the routes
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');


mongoose.connect(
    'mongodb://node-shop-user:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-shop-shard-00-00-b37e1.mongodb.net:27017,node-rest-shop-shard-00-01-b37e1.mongodb.net:27017,node-rest-shop-shard-00-02-b37e1.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true', 
    {
        useNewUrlParser: true
    }
).catch(error => {
    console.log(error)
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, x-Requested-with, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
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

module.exports = app;