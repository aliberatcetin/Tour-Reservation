const express = require('express');
const router = express.Router();
var path = require('path');
var uuid = require('uuid');
var multer = require('multer');
var Image = require('../models/image');

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



router.post('/image',upload.single('file'),function(req,res){
    console.log(req.file.filename);
    res.send(req.file.filename);
});

//router.get('/:categoryName',tourController.renderTours)


module.exports=router;