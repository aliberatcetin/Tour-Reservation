const express = require('express');
const router = express.Router();
var path = require('path');
var uuid = require('uuid');
var multer = require('multer');
var auth = require('../middlewares/authMiddleware');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot+'/public/assets/images')
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
  }
})


//router.use(express.static(path.join(appRoot, 'public')));

const upload = multer({
  storage : storage // this saves your file into a directory called "uploads"
});

var tourController = require('../controllers/tourController.js');

router.post('/update/:tourId',auth.isLoggedIn,upload.any(),tourController.updateById);
router.post('/delete/:tourId',auth.isLoggedIn,tourController.deleteImageFromGalleryByTourId)
router.get('/delete/:tourId',auth.isLoggedIn,tourController.deleteTourById);
router.post('/',auth.isLoggedIn,upload.any(),tourController.createTour);
router.get('/',tourController.renderAllToursDisplay);

router.get('/find/:tourId/',tourController.findSingleTour);

router.get('/:category/:tourName',tourController.renderSingleTour);

router.get('/:category',tourController.renderToursByCategoryName);

router.get('/copy/:tourname/:newname/:newcategory',tourController.copyTourByCategory);



//router.get('/:categoryName',tourController.renderTours)





module.exports=router;