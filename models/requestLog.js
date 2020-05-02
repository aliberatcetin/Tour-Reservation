const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uniqueValidator = require('mongoose-unique-validator')
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const RequestSchema = mongoose.Schema({
    ip: {type:String},
    lastRequest: { type: Number}
}, {
        timestamps: true
    });
//TourSchema.plugin(uniqueValidator);
var requestSchema = mongoose.model('Request', RequestSchema);

module.exports = requestSchema;


