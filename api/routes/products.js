const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map( doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: req.protocol + "://" + req.host + ":" + process.env.port + req.originalUrl + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    });
    product.save()
    .then(result => {
        res.status(200).json({
            message: "Product created successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: req.protocol + "://" + req.host + ":" + process.env.port + req.originalUrl + "/" + result._id
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

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    description: "Get all products",
                    url: req.protocol + "://" + req.host + ":" + process.env.port + req.baseUrl + "/"
                }
            });
        } else {
            res.status(404).json({message: "No valid entry found for provided ID"});
        } 
        
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    
});

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for ( const ops of req.body ) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product updated",
            request: {
                type: "GET",
                url: req.protocol + "://" + req.host + ":" + process.env.port + req.baseUrl + "/" + id 
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

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Deleted successfully",
            request: {
                type: "POST",
                url: req.protocol + "://" + req.host + ":" + process.env.port + req.baseUrl + "/",
                body: {
                    name: "String",
                    price: "Number"
                } 
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

module.exports = router;