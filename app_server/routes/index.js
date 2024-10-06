const express = require('express');
const router = express.Router();
const ctrlMain = require('../Controllers/main'); 
/* GET home page. */
router.get('/', ctrlMain.index); 
router.get('/about',ctrlMain.about);
router.get('/names', ctrlMain.names);
router.get('/beans', ctrlMain.names);
router.get('/main', ctrlMain.main);


module.exports = router;
