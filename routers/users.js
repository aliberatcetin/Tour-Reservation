const express = require('express');
const router = express.Router();
const path = require('path');
var passport = require('passport');

var userController = require('../controllers/userController');
router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/tours',
    failureRedirect : '/users/login'
}));

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/auth/profile',
    failureRedirect : 'auth/signup'
}));

//router.post('/login',userController.login)

console.log(appRoot);


module.exports=router;