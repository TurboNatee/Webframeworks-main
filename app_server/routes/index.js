const express = require('express');
const router = express.Router();
const ctrlMain = require('../Controllers/main'); 
/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/Login', ctrlMain.Login);
router.get('/Register', ctrlMain.Register);
router.get('/Homepage', ctrlMain.Homepage);


module.exports = router;
