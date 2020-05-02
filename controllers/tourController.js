var tourService = require('../services/tourService');
var categoryService = require('../services/categoryService');
var path = require('path');

var displayService = require('../services/displayService');

function renderCategories(req, res) {
    categoryService.findCategories().then(function (categories) {
        res.render('categories', { categories: categories })
    }).catch(function (err) {
        console.log(err);
    });
}
function renderAllToursDisplay(req, res) {
    tourService.findAllApproved().then(function (tours) {
        displayService.findDisplayByName("siteconfig").then(function (display) {
            res.render('displayalltours', { tours: tours, display: display });
        }).catch(function(err){
            res.render('displayalltours', { tours: tours, display: null });
        });
    }).catch(function (err) {
        res.render('displayalltours', { tours: null, display: null });
    });
}
function renderTours(req, res) {
    tourService.findApprovedToursByCategory(req.params.category).then(function (response) {
        /*res.status=200;
        res.json(response);*/
        categoryService.findCategoryById(req.params.category).then(function (categoryResponse) {
            res.render('tours', { tours: response, cc: req.params.category, categoryImage: categoryResponse.imageUrl });
        }).catch(function (err) {
            res.render('404');
        });
    }).catch(function (err) {
        res.render('404');
    });
}

function copyTourByCategory(req, res) {
    tourService.findOneByNameApprovedOptional(req.params.tourname).then(function(tour){
        tourService.copyTour(tour,req.params.newname,req.params.newcategory).then(function(copied){
            res.sendStatus(200);
        }).catch(function(copyerror){
            var resp={
                message:"asd"
            }
            res.status(400).json(copyerror);
        });
    }).catch(function(err){
        res.status(400).json("anlamsiz");
    });
}

function renderToursByCategoryName(req, res) {
    tourService.findApprovedToursByCategoryName(req.params.category).then(function (response) {
        /*res.status=200;
        res.json(response);*/
        categoryService.findCategoryByName(req.params.category).then(function (categoryResponse) {
            res.render('tours', { tours: response, cc: req.params.category, categoryImage: categoryResponse.imageUrl, headerDisplay: categoryResponse.headerDisplay });
        }).catch(function (err) {
            res.render('404');
        });
    }).catch(function (err) {
        res.render('404');
    });
}


function updateById(req, res) {

    tourService.update(req).then(function (tour) {
        //res.sendStatus(200);
        // res.redirect(tour.category+ '/' + tour._id);
        res.redirect(req.get('referer'));

        //res.redirect('/tours/'+tour.category+'/'+tour._id);
    }).catch(function (err) {
        res.sendStatus(500);
    });
}

function createTour(req, res) {
    categoryService.findCategories().then(function (categories) {
        tourService.create(req).then(function (response) {
            res.render('addtour', { layout: 'addtoursmain', success_msg: "tour added", categories: categories });
        }).catch(function (err) {
            res.render('addtour', { layout: 'addtoursmain', error: err, categories: categories });
        });
    }).catch(function (err) {

    });
}

function renderSingleTour(req, res) {
    categoryService.findCategoryByName(req.params.category).then(function (response) {
        tourService.findOneByName(req.params.tourName).then(function (tour) {
            res.render('toursingle', { tour: tour });
        }).catch(function (err) {
            console.log(err);
            res.render('404');
        });
    }).catch(function (err) {
        console.log(err);
        res.render('404');
    });
};



function findSingleTour(req, res) {
    tourService.findOneApprovedOptional(req.params.tourId).then(function (tour) {
        /*res.status=200;
        res.json(tour);*/
        res.status(200).json(tour);
    }).catch(function (err) {
        console.log("bulamadik");
        res.sendStatus(404);
    });
}

function deleteTourById(req, res) {
    tourService.deleteById(req.params.tourId).then(function (err) {
        res.sendStatus(200);
    }).catch(function (err) {
        res.sendStatus(404);
    });
}

function deleteImageFromGalleryByTourId(req, res) {
    tourService.deleteImageFromGalleryByTourId(req.params.tourId, req.body.imageId).then(function (response) {
        res.sendStatus(200);
    }).catch(function (err) {
        res.sendStatus(500);
    });
};

module.exports = {
    createTour,
    renderTours,
    renderCategories,
    renderSingleTour,
    findSingleTour,
    updateById,
    deleteImageFromGalleryByTourId,
    deleteTourById,
    renderToursByCategoryName,
    renderAllToursDisplay,
    copyTourByCategory
}