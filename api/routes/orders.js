const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('-__v')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                console.log(doc);
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: req.protocol + "://" + req.host + ":" + process.env.port + req.originalUrl + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    // Order.find((err,result) => {
    //     if(err) {
    //         res.status(500).json({
    //             error: err
    //         });
    //     }
    //     res.status(200).json({
    //         message: result
    //     });
    // });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productID)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId,
            quantity: req.body.quantity,
            product: req.body.productID
        });
        return order.save()
        
    })
    .then((result , err) => {
        console.log(result);
        res.status(201).json({
            message: "Order created",
            orderDetails: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: req.protocol + "://" + req.host + ":" + process.env.port + req.originalUrl + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID)
    .select('-__v')
    .populate('product')
    .then(doc => {
        if (!doc) {
            return res.status(404).json({
                message: "Order doesn't exist"
            });
        }
        res.status(200).json({
            order: doc,
            request: {
                type: "GET",
                description: "Get all orders",
                url: req.protocol + "://" + req.host + ":" + process.env.port + req.baseUrl + "/"
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderID', (req, res, next) => {
    Order.remove({_id: req.params.orderID})
    .then(result => {
        res.status(200).json({
            message: "Order deleted successfully",
            request: {
                type: "POST",
                url: req.protocol + "://" + req.host + ":" + process.env.port + req.baseUrl + "/",
                body: {
                    product: "String",
                    quantity: "Number"
                } 
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;