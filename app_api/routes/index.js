const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/Homepage');

// Define the API route for fetching a product by ID
router.get('/homepage/:id', ctrlMain.handleHomepageGet); // Adjust to match the function

module.exports = router;
