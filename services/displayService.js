const SiteDisplay = require('../models/siteDisplay');

module.exports = {
	update,
	findDisplayByName
}

function getNewDisplay(displayParam,oldDisplay){
	var destinations = displayParam.destinations;
	var alltours = displayParam.alltours;
	var tempDisplay={
		destinations:destinations,
		name:oldDisplay.name,
		alltours:alltours
	}
	return tempDisplay;
	
}

function findDisplayByName(displayName) {
	return new Promise(function (resolve, reject) {
		SiteDisplay.findOne({ name: displayName }, (err, doc) => {
			if (err || doc == null) {
				reject(err);
			} else {
				resolve(doc);
			}
		});
	});
}

function update(form) {
	return new Promise(function (resolve, reject) {
		findDisplayByName("siteconfig").then(function(display){
			var referenceDisplay = getNewDisplay(form,display);
			SiteDisplay.findOneAndUpdate({ name: "siteconfig" }, referenceDisplay,{new:true} /*{ $set: { name: referenceTour.name } }*/).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function(err){
			var tempDisplay = new SiteDisplay({name:"siteconfig",destinations:"All Destinations",tours:"All Tours"});
			tempDisplay.save().then(function(saved){
				resolve(saved);
			}).catch(function(err2){
				reject(err2);
			});
		});
	});
}
