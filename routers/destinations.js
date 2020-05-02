const express = require('express');
const router = express.Router();
var path = require('path');
var uuid = require('uuid');
var categoryService = require('../services/categoryService');

var destinationController = require('../controllers/destinationController');


//router.use(express.static(path.join(appRoot, 'public')));


var tourController = require('../controllers/destinationController.js');

router.get('/',destinationController.renderDestinations);



//router.get('/:categoryName',tourController.renderTours)



module.exports=router;