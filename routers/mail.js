var express = require('express');
var router = express.Router();
var path = require('path');
var nodemailer = require('nodemailer');
var requestService = require('../services/requestService');
//router.use('/',isLoggedIn);


var smtpTransport = require('nodemailer-smtp-transport');


router.use(isLimited);

function isLimited(req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(ip)
    var milliseconds = (new Date).getTime();
    var epoch = Math.floor(milliseconds / 1000);

    requestService.find(ip).then(function (asd) {
        if (epoch - asd.lastRequest < 10) {
            res.status(400).json({
                'message': 'rate limited'
            });
        } else {
            requestService.update(ip, epoch).then(function (updated) {
                //console.log(updated);
            }).catch(function (err) {
                //console.log(err);
            });
            next();
        }

    }).catch(function (err) {
        requestService.create(ip, epoch).then(function (ok) {
            console.log(ok);
        }).catch(function (err) {
            console.log(err);
        });
    });

}

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: '',//env
        pass: ''//env
    }
});



router.post('/', function (req, res) {
    var mailOptions = {
        from: '',//env
        to: '', //env
        subject: 'New Mail On PTT',
        text: 'Guest Name:'+req.body.name +'\nNumber of Guests:'+req.body.guests+ '\nTour Date:'+ req.body.tourdate +'\nPhone:'+ req.body.phone+ '\nEmail:'+ req.body.email + '\nSpecial Request:'+ req.body.text
        +'\nSite Location:'+req.body.sitelocation
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({
                'message': 'error'
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200);
        }
    });
});

router.post('/custom', function (req, res) {

    var body = JSON.stringify(req.body);
    var cities = []
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] == "on") {
            cities.push(key)
        }
    });
    var text = 'Name:' + req.body.name + ' ' + req.body.surname + '\nEmail:' + req.body.email + '\nArrival Date:' + req.body.arrivaldate
        + '\nDeparture Date:' + req.body.departuredate + '\nAdult:' + req.body.adult + '\nChildren:' + req.body.children
        + '\nSpecial Request:' + req.body.message + '\nCities:' + cities
    var mailOptions = {
        from: '',//env
        to: '',//env
        subject: 'Custom Made Tour Form',
        text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({
                'message': 'error'
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200);
        }
    });
});

router.post('/contact', function (req, res) {

    var body = JSON.stringify(req.body);
    var text='Name:'+req.body.inputname+req.body.surname+'\nPhone:'+req.body.phone+'\nMessage:'+req.body.message
                    +'\nEmail:'+req.body.email
    var mailOptions = {
        from: '',//env
        to: '',//env
        subject: 'Contact Form',
        text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({
                'message': 'error'
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200);
        }
    });
});

module.exports = router;
