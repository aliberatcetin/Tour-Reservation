const express = require('express');
const router = express.Router();

var homeController = require('../controllers/homeController');

router.get('/',homeController.renderHome);


module.exports=router;