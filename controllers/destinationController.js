var categoryService = require('../services/categoryService');
var displayService = require('../services/displayService');

function renderDestinations(req,res){
    categoryService.findCategories().then(function (categories) {
        displayService.findDisplayByName("siteconfig").then(function(display){
            res.render('categories', { categories: categories,display:display });
        }).catch(function(err){
            res.render('categories', { categories: categories,display:null });
        });
        
    }).catch(function (err) {
        res.render('categories', { categories: null,display:null });
    });
}

module.exports = {
    renderDestinations
}