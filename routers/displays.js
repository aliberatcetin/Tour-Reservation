var express = require('express');
var router = express.Router();
var displayService = require('../services/displayService');
router.post('/update',update);

function update(req,res){
    displayService.update(req.body).then(function(updated){
        res.redirect('/panel/editdisplay');
    }).catch(function(err){
        res.sendStatus(500);
    });
   
}

module.exports = router;

