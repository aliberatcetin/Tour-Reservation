const express = require('express');
const router = express.Router();
var categoryController = require('../controllers/categoryController');
const multer = require('multer');
var path = require('path');
var uuid = require('uuid');
var auth = require('../middlewares/authMiddleware');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot+'/public/assets/images')
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
  }
})



const upload = multer({
  storage : storage // this saves your file into a directory called "uploads"
});

router.get('/delete/:categoryId',auth.isLoggedIn,categoryController.deleteById);
router.post('/update/:categoryId',auth.isLoggedIn,upload.any(),categoryController.updateById);
router.post('/',auth.isLoggedIn,/*upload.array('file',2)*/upload.single('file'),categoryController.create); 
router.get('/find/:categoryId', categoryController.findOneById);
router.get('/list',categoryController.list);
module.exports=router;

