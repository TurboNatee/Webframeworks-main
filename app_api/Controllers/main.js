// app_api/controllers/main.js
const mongoose = require('mongoose');
const Product = mongoose.model('products');
exports.getHomepage = (req, res) => {
    res.status(200).json({ message: "Welcome to the Homepage!" });
};


