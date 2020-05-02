const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uniqueValidator = require('mongoose-unique-validator')
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const ImageSchema = mongoose.Schema({
    url: {type:String,required: true},
}, {
        timestamps: true
    });
//TourSchema.plugin(uniqueValidator);
var imageSchema = mongoose.model('Image', ImageSchema);

module.exports = imageSchema;


