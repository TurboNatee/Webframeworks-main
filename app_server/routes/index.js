const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');  // Correct path to your controller

// Handle GET requests for login and register
router.get('/', ctrlMain.index);
router.get('/Login', ctrlMain.Login);
router.get('/Register', ctrlMain.Register);
router.get('/Homepage', ctrlMain.homelist);
router.get('/logout', ctrlMain.Logout);
// Handle POST requests for login and register
router.post('/Login', ctrlMain.Login);  // POST route for login
router.post('/Register', ctrlMain.Register);  // POST route for registration

module.exports = router;
