var express = require('express');
var router = express.Router();
var path = require('path');
var panelController = require('../controllers/panelController');
var auth = require('../middlewares/authMiddleware');

//router.use('/',isLoggedIn);
router.use(auth.isLoggedIn);

router.get('/', panelController.renderPanel);
router.get('/addtour', panelController.renderAddTours);
router.get('/alltours', panelController.renderAllTours);
router.get('/allcategories', panelController.renderAllCategories);
router.get('/addcategory', panelController.renderAddCategories);
router.get('/edittour/:tourId', panelController.renderEditTour);
router.get('/editcategory/:categoryId', panelController.renderEditCategory);
router.get('/editdisplay', panelController.renderEditDisplays);



router.use(express.static(path.join(appRoot, 'public')));

module.exports = router;
