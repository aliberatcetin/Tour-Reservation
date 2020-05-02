var categoryService = require('../services/categoryService');


function validate(request) {
    if (typeof request.file == "undefined" || request.body.name.length == 0) {
        console.log("problem");
        return 0;
    } else {
        return 1;
    }
}

function create(req, res) {
    if (!validate(req)) {
        res.render('addcategory', { error: "category form is not valid" });
        return;
    }

    categoryService.create(req).then(function (response) {
        res.render('addcategory', { success_msg: "category added" });
    }).catch(function (err) {
        res.render('addcategory', { error: err });
    });

}

function findOne(req, res) {
    categoryService.findCategoryByName(req.params.category).then(function (category) {
        res.status(200).json(tour);
    }).catch(function (err) {
        res.sendStatus(404);
    });
}

function updateById(req, res) {
    categoryService.update(req, res).then(function (category) {
        res.redirect('/panel/editcategory/'+category._id);
    }).catch(function (err) {
        console.log(err);
    });
};

function deleteById(req, res) {
    categoryService.deleteById(req.params.categoryId).then(function (deleteResponse) {
        res.sendStatus(200);
    }).catch(function (err) {
        res.sendStatus(500);
    });
};

function findOneById(req, res) {
    categoryService.findCategoryById(req.params.categoryId).then(function (category) {
        res.status(200).json(category);
    }).catch(function (err) {
        res.sendStatus(404);
    });
};

function list(req, res) {
    categoryService.findCategories().then(function (categories) {
        res.status(200);
        res.json(categories);
    }).catch(function (err) {
        res.sendStatus(404);
    });
};
module.exports = {
    create,
    findOne,
    list,
    findOneById,
    updateById,
    deleteById
}