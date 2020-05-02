const Tour = require('../models/tour');
var categoryService = require('./categoryService');

module.exports = {
	create,
	findApprovedToursByCategory,
	findOne,
	update,
	findAll,
	getPopulars,
	deleteImageFromGalleryByTourId,
	deleteById,
	findOneApprovedOptional,
	findApprovedToursByCategoryName,
	findOneByName,
	findOneByNameApprovedOptional,
	copyTour,
	findAllApproved
}

function getNewTourToCopy(oldTour, newname,newcategoryid, newcategoryname) {
	var newdisplayname = newname.replace(/\s/g, "-");
	var tempTour = new Tour( {
		name: newname,
		displayName: newdisplayname,
		inclusions: oldTour.inclusions,
		category: newcategoryid,
		//categoryName: oldTour.categoryName,
		exclusions: oldTour.exclusions,
		highlights: oldTour.highlights,
		labels: oldTour.labels,
		duration: oldTour.duration,
		location: oldTour.location,
		itinerary: oldTour.itinerary,
		thumbnailImage: oldTour.thumbnailImage,
		imageGallery: oldTour.imageGallery,
		approved: oldTour.approved,
		popular: oldTour.popular,
		price: oldTour.price,
		numerical: oldTour.numerical,
		pricingtype: oldTour.pricingtype,
		priority: oldTour.priority,
		categoryName: newcategoryname
	});
	return tempTour;
}

function checkOccurence(tourname) {
	return new Promise(function (resolve, reject) {
		findOneByNameApprovedOptionalNotDeleted(tourname).then(function (tour) {
			reject(false);
		}).catch(function (err) {
			resolve(true);
		});
	});
}

function copyTour(oldtour, newname, newcategory) {
	return new Promise(function (resolve, reject) {
		checkOccurence(newname).then(function(nulltour){
			categoryService.findCategoryById(newcategory).then(function(category){
				var tempNewTour = getNewTourToCopy(oldtour,newname,newcategory,category.name);
				tempNewTour.save().then(function(copiedTour){
					resolve(true);
				}).catch(function(copyError){
					reject("kaydedemedik bir şekilde.")
				});
			}).catch(function(err){
				reject("kategori yok ki");
			});
		}).catch(function(err){
			reject("aynı isimde başka tur var."); 
		});
	});
}

function findOne(tourId) {
	return new Promise(function (resolve, reject) {
		Tour.findOne({ _id: tourId, isDeleted: false, approved: true }).then(function (tour) {
			if (tour)
				resolve(tour);
			else
				reject(false);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function findOneByNameApprovedOptional(tourName) {
	return new Promise(function (resolve, reject) {
		Tour.findOne({ displayName: tourName }).then(function (tour) {
			if (tour)
				resolve(tour);
			else
				reject(false);
		}).catch(function (err) {
			reject(err);
		});
	});

}

function findOneByNameApprovedOptionalNotDeleted(tourName) {
	return new Promise(function (resolve, reject) {
		Tour.findOne({ displayName: tourName, isDeleted: false }).then(function (tour) {
			if (tour)
				resolve(tour);
			else
				reject(false);
		}).catch(function (err) {
			reject(err);
		});
	});

}

function findOneByName(tourName) {
	return new Promise(function (resolve, reject) {
		Tour.findOne({ name: tourName, isDeleted: false, approved: true }).then(function (tour) {
			if (tour)
				resolve(tour);
			else
				reject(false);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function findOneApprovedOptional(tourId) {
	return new Promise(function (resolve, reject) {
		Tour.findOne({ _id: tourId, isDeleted: false }).then(function (tour) {
			if (tour)
				resolve(tour);
			else
				reject(false);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function getNewTour(tourParam, oldTour, req) {
	var inc = tourParam.inc.split(',');
	var exc = tourParam.exc.split(',');
	var high = tourParam.high.split(',');
	var labels = tourParam.labels.split(',');
	var imageGallery;


	//console.log(req.files);
	var thumbImage = "";

	if (req.files.length > 0) {
		imageGallery = req.files.map(e => e.filename).join(",");
		imageGallery = imageGallery.split(',');

		var thumbIndex = -1;

		for (var i = 0; i < req.files.length; i++) {
			if (!req.files[i].fieldname.localeCompare("file")) {
				thumbIndex = i;
			}
		}
		if (thumbIndex > -1) {

			thumbImage = imageGallery[thumbIndex];
			imageGallery.splice(thumbIndex, 1);
		} else {
			thumbImage = oldTour.thumbnailImage;
		}
		for (var i = 0; i < oldTour.imageGallery.length; i++) {
			imageGallery.push(oldTour.imageGallery[i]);
		}

	} else {
		thumbImage = oldTour.thumbnailImage;
		imageGallery = oldTour.imageGallery;
	}

	/*var thumbnailImage;
	if(thumbIndex>-1){
		thumbnailImage = imageGallery[thumbIndex];
		imageGallery.splice(thumbIndex, 1);
	}else{
		thumbnailImage=oldTour.thumbnailImage;
	}*/


	oldTour.name = tourParam.name;

	/*var tempTour = new Tour({
		name: tourParam.name, inclusions: inc, category: tourParam.category, categoryName: tourParam.categoryName,
		exclusions: exc, highlights: high, labels: labels, duration: tourParam.duration, location: tourParam.location,
		itinerary: tourParam.message2, thumbnailImage: oldTour.thumbnailImage, imageGallery: imageGallery
	});*/

	var approved;
	if (!tourParam.type.localeCompare("draft"))
		approved = false;
	else
		approved = true;

	var popular;
	if (tourParam.popular) {
		popular = true;
	} else {
		popular = false;
	}

	displayName = tourParam.name;
	tourParam.name = tourParam.name.replace(/\s/g, "-");

	var tempTour = {
		name: tourParam.name,
		displayName: displayName,
		inclusions: inc,
		category: oldTour.category,
		//categoryName: oldTour.categoryName,
		exclusions: exc,
		highlights: high,
		labels: labels,
		duration: tourParam.duration,
		location: tourParam.location,
		itinerary: tourParam.message2,
		thumbnailImage: thumbImage,
		imageGallery: imageGallery,
		approved: approved,
		popular: popular,
		price: tourParam.price,
		numerical: tourParam.numerical,
		pricingtype: tourParam.pricingtype,
		priority: tourParam.priority,
		categoryName: oldTour.categoryName
	};
	return tempTour;

}

function deleteById(tourId) {
	return new Promise(function (resolve, reject) {
		Tour.findOneAndUpdate({ _id: tourId }, { $set: { isDeleted: true } }).then(function (res) {
			resolve(res);
		}).catch(function (err) {
			reject(err);
		});
	});

}

function update(req) {
	return new Promise(function (resolve, reject) {
		Tour.find({ _id: req.params.tourId }).then(function (tour) {
			var referenceTour = getNewTour(req.body, tour[0], req);
			//console.log(referenceTour);
			Tour.findOneAndUpdate({ _id: req.params.tourId }, referenceTour /*{ $set: { name: referenceTour.name } }*/).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
}

function getPopulars() {
	return new Promise(function (resolve, reject) {
		Tour.find({ popular: true, approved: true, isDeleted: false }).then(function (res) {
			resolve(res);
		});
	});
}

function findAllApproved() {
	return new Promise(function (resolve, reject) {
		Tour.find({ isDeleted: false,approved:true }).then(function (res) {
			resolve(res);
		});
	});
}
function findAll() {
	return new Promise(function (resolve, reject) {
		Tour.find({ isDeleted: false }).then(function (res) {
			resolve(res);
		});
	});
}

function findApprovedToursByCategory(category) {
	return new Promise(function (resolve, reject) {
		query = {}
		query.sort = { priority: 1 };
		categoryService.findCategoryById(category).then(function (categoryResponse) {
			Tour.find({ category: categoryResponse._id, approved: true, isDeleted: false }, {}, query, function (err, data) {
				resolve(data);
			}).catch(function (err) {
				reject(false);
			})
		}).catch(function (err) {
			reject(false);
		});
	});
}
function findApprovedToursByCategoryName(category) {
	return new Promise(function (resolve, reject) {
		query = {}
		query.sort = { priority: 1 };
		categoryService.findCategoryByName(category).then(function (categoryResponse) {
			Tour.find({ category: categoryResponse._id, approved: true, isDeleted: false }, {}, query, function (err, data) {
				resolve(data);
			}).catch(function (err) {
				reject(false);
			})
		}).catch(function (err) {
			reject(false);
		});
	});
}

function deleteImageFromGalleryByTourId(tourId, imageId) {
	return new Promise(function (resolve, reject) {
		Tour.findOne({ _id: tourId }).then(function (tour) {
			var index = tour.imageGallery.indexOf(imageId);
			if (index !== -1) tour.imageGallery.splice(index, 1);
			Tour.findOneAndUpdate({ _id: tourId }, tour).then(function (updatedTour) {
				resolve(true);
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
}

function tourPreprocess(tourParam, categoryId, req, categoryName) {
	var inc = tourParam.inc.split(',');
	var exc = tourParam.exc.split(',');
	var high = tourParam.high.split(',');
	var labels = tourParam.labels.split(',');

	var thumbIndex = -1;
	for (var i = 0; i < req.files.length; i++) {
		if (!req.files[i].fieldname.localeCompare("file")) {
			thumbIndex = i;
		}
	}

	var imageGallery = req.files.map(e => e.filename).join(",");
	imageGallery = imageGallery.split(',');


	var thumbnailImage;
	if (thumbIndex > -1) {
		thumbnailImage = req.files[thumbIndex].filename;
		imageGallery.splice(thumbIndex, 1);
	} else {
		thumbnailImage = null;
	}




	//imageGallery = imageGallery.slice(1); removes first element
	var approved;
	if (!tourParam.type.localeCompare("draft"))
		approved = false;
	else
		approved = true;

	var popular;
	if (tourParam.popular) {
		popular = true;
	} else {
		popular = false;
	}
	name = tourParam.name.replace(/\s/g, "-");
	var tempTour = new Tour({
		name: name, displayName: tourParam.name, inclusions: inc, category: categoryId,
		exclusions: exc, highlights: high, labels: labels, duration: tourParam.duration, location: tourParam.location,
		itinerary: tourParam.message2, thumbnailImage: thumbnailImage, imageGallery: imageGallery, approved: approved,
		popular: popular, numerical: tourParam.numerical, price: tourParam.price,
		pricingtype: tourParam.pricingtype, priority: tourParam.priority, categoryName: categoryName
	});
	return tempTour;
}

function create(tourParam) {
	return new Promise(function (resolve, reject) {
		checkOccurence(tourParam.body.name).then(function (r) {
			categoryService.findCategoryById(tourParam.body.category).then(function (res) {
				tempTour = tourPreprocess(tourParam.body, res._id, tourParam, res.name);
				if (!tempTour) {
					reject("form is not valid");
				} else {
					tempTour.save().then(function (tourCreated) {
						resolve(tourCreated);
					}).catch(function (err) {
						reject(err);
					});
				}
			}).catch(function (err) {
				console.log(err);
				reject("category not found");
			});
		}).catch(function (err2) {
			reject("already exists");
		});

	});
}
