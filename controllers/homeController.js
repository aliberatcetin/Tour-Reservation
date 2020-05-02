var tourService = require('../services/tourService');


function renderHome(req,res){
    tourService.getPopulars().then(function(popularTours){
        res.render('index',{populars:popularTours});
    }).catch(function(err){
        console.log(err);
    });
}

module.exports = {
    renderHome
}