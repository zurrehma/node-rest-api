const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling GET requests to /product"
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling POST requests to /products"
    });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    res.status(200).json({
        message: "Your productID is " + id
    });
});

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    res.status(200).json({
        message: "Product Updated " + id
    });
});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    res.status(200).json({
        message: "Product deleted " + id
    });
});

module.exports = router;