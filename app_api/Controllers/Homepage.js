const { request } = require('request');
const mongoose = require('mongoose');
const Product = mongoose.model('products');  // Ensure this matches the model name 'products'
const apiOptions = {
server : 'http://localhost:3000'
};





const ProductsReadAll = function (req, res) {
    Product
    .find()
    .then((Product, err) => {
    if (!Product) {
    res
    .status(404)
    .json({
    "message": "products id not found"
    });
    return;
    } else if (err) {
    res
    .status(404)
    .json(err);
    return;
    }
    res
    .status(200)
    .json(Product);
    });
    };
    
    module.exports = {
    ProductsReadAll
    };
