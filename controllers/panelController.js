var categoryService = require('../services/categoryService');
var tourService = require('../services/tourService');
var displayService = require('../services/displayService');
function renderPanel(req, res) {
    categoryService.findCategories().then(function (categories) {
        res.render('panel', { categories: categories });
    }).catch(function (err) {

    });
}

function renderAddTours(req, res) {
    categoryService.findCategories().then(function (categories) {
        res.render('addtour', { layout: 'addtoursmain', categories: categories });
    }).catch(function (err) {

    });
}

function renderAllTours(req, res) {
    tourService.findAll().then(function (tours) {
        res.render('alltours', { tours: tours })
    }).catch(function (err) {
    });
};

function renderAllCategories(req, res) {
    categoryService.findCategories().then(function (categories) {
        res.render('allcategories', { categories: categories })
    }).catch(function (err) {
    });
};

function renderEditCategory(req, res) {

    categoryService.findCategoryById(req.params.categoryId).then(function (category) {
        res.render('editcategory');
    }).catch(function (err) {
        res.render('404');
    })
}

function renderEditTour(req, res) {
    tourService.findOneApprovedOptional(req.params.tourId).then(function (tour) {
        res.render('edittour', { layout: 'addtoursmain' });
    }).catch(function (err) {
        res.render('404');
    })
}

function renderAddCategories(req, res) {
    res.render('addcategory');
}

function renderEditDisplays(req,res){
    displayService.findDisplayByName("siteconfig").then(function(display){
        res.render('editdisplay',{display:display});
    }).catch(function(err){
        res.render('editdisplay',{display:""});
    });
}

module.exports = {
    renderPanel,
    renderAddTours,
    renderAddCategories,
    renderEditTour,
    renderAllTours,
    renderAllCategories,
    renderEditCategory,
    renderEditDisplays
}
