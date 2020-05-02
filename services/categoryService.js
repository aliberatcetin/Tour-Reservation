const Categories = require('../models/category');
const Tour = require('../models/tour');
module.exports = {
	findCategoryByName,
	create,
	findCategories,
	findCategoryById,
	update,
	deleteById
}

function getNewCategory(categoryParam, oldCategory, req) {
	var displayName = categoryParam.name;
	var headerDisplay = categoryParam.headerdisplay;
	var name = categoryParam.name.replace(/\s/g, "-");

	var imageUrl = "";
	if (req.files.length > 0) {
		imageUrl = req.files[0].filename;
	} else {
		imageUrl = oldCategory.imageUrl;
	}
	var tempCategory = {
		name: name,
		imageUrl: imageUrl,
		displayName:displayName,
		headerDisplay:headerDisplay
	}
	return tempCategory;
}

function deleteById(categoryId) {
	var criteria = {
		category: categoryId
	};
	Tour.updateMany(criteria,{ isDeleted: true }).then(function(response){
		console.log(response);
	}).catch(function(err){
		console.log(err);
	});

	/*Tour.update(criteria, { isDeleted: true }, { multi: true }, function (err, res) {
		if (err) {
			console.log(err);
		} else {
			console.log("hey");
		}
	});*/


	return new Promise(function (resolve, reject) {
		Categories.findOneAndUpdate({ _id: categoryId }, { $set: { isDeleted: true } }).then(function (category) {
			resolve(category);
		}).catch(function (err) {
			reject(err);
		});
	});
}


function update(req, res) {

	/*{ $set: { name: referenceTour.name } }*/
	return new Promise(function (resolve, reject) {
		Categories.find({ _id: req.params.categoryId }).then(function (category) {
			var referenceCategory = getNewCategory(req.body, category[0], req);
			Categories.findOneAndUpdate({ _id: req.params.categoryId }, referenceCategory).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
}

function findCategoryByName(categoryName) {
	return new Promise(function (resolve, reject) {
		Categories.findOne({ name: categoryName, isDeleted: false }, (err, doc) => {
			if (err || doc == null) {
				reject(err);
			} else {
				resolve(doc);
			}
		});
	});
}

function findCategoryById(id) {
	return new Promise(function (resolve, reject) {
		Categories.findOne({ _id: id, isDeleted: false }, (err, doc) => {
			if (err || doc == null) {
				reject(err);
			} else {
				resolve(doc);
			}
		});
	});
}

function findCategoryByNameDeleted(categoryName) {
	return new Promise(function (resolve, reject) {
		Categories.findOne({ name: categoryName, isDeleted: true }, (err, doc) => {
			if (err || doc == null) {
				reject(err);
			} else {
				resolve(doc);
			}
		});
	});
}

function create(req) {
	return new Promise(function (resolve, reject) {
		findCategoryByName(req.body.name).then(function (foundCategory) {
			reject("already exists");
		}).catch(function (err1) {
			findCategoryByNameDeleted(req.body.name).then(function (deletedCategory) {
				Categories.findOneAndUpdate({ _id: deletedCategory._id }, { $set: { isDeleted: false, imageUrl: req.file.filename } }).then(function (updatedCategory) {
					resolve(updatedCategory);
				}).catch(function (err2) {
					reject(err2);
				});
			}).catch(function (err3) {
				name = req.body.name.replace(/\s/g, "-");
				var categoryToSave = new Categories({ name:name,displayName:req.body.name,headerDisplay:req.body.headerDisplay, imageUrl: req.file.filename });
				categoryToSave.save().then(function (savedCategory) {
					resolve(savedCategory);
				}).catch(function (err4) {
					reject(err4);
				});
			});
		});
	});
}

function findCategories() {

	return new Promise(function (resolve, reject) {
		query={}
		query.sort = { createdAt: 1 };
		Categories.find({ isDeleted: false },{},query).then(function (res) {
			resolve(res);
		});
		
    	/*Categories.find({ isDeleted: false }, {}, query, function (err, data) {
        // Mongo command to fetch all data from collection.
        resolve(data);
    	});*/
	});
}