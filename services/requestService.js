const Request = require('../models/requestLog');

module.exports = {
	find,
	create,
	update
}

function find(ip) {
	return new Promise(function (resolve, reject) {
		Request.findOne({ ip: ip }).then(function (log) {
			if (log)
				resolve(log);
			else
				reject(false);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function create(ip, time) {
	return new Promise(function (resolve, reject) {
		var tempRequest = new Request({ ip: ip, lastRequest: time });
		tempRequest.save().then(function (tourCreated) {
			resolve(tourCreated);
		}).catch(function (err) {
			reject(err);
		});


	});
}

function update(ip, time) {
	return new Promise(function (resolve, reject) {

		Request.findOneAndUpdate({ ip: ip }, { $set: { lastRequest: time } }).then(function (res) {
			resolve(res);
		}).catch(function (err) {
			reject(err);
		});
	});

}
