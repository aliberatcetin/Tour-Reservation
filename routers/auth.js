var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

/*
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/auth/profile',
    failureRedirect : 'auth/signup'
}));*/

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        console.log("loggedin");
        res.redirect('/panel');
    } else {
        console.log("notlogged");
        res.render('login');
    }
});

/*function hello(req,res,next){
    passport.authenticate('local-login', function(err, user, info) {
        if (err)
            return next(err);
        if(!user)
            return res.status(400).json({SERVER_RESPONSE: 0, SERVER_MESSAGE: "Wrong Credentials"});
        req.logIn(user, function(err) {
            if (err)
                return next(err);
            if (!err)
                return res.json({ SERVER_RESPONSE: 1, SERVER_MESSAGE: info });
            
        });
    })(req, res, next);
}
router.post('/login',hello);*/


router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/panel/',
    failureRedirect : '/auth/login'
}));



router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/');
});

//router.use(express.static(path.join(appRoot, 'public')));

module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}