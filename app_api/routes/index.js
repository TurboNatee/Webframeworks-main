const express = require('express');
const router = express.Router();
const ctrlMain = require('../Controllers/Homepage.js');

// Define the API route for fetching a product by ID
router.get('/homepage/', ctrlMain.ProductsReadAll); // Adjust to match the function

module.exports = router;
