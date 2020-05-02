const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uniqueValidator = require('mongoose-unique-validator')
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const SiteDisplaySchema = mongoose.Schema({
    name:{type:String,default:null,unique:true},
    destinations: {type:String,default:"All Destinations"},
    alltours: {type:String,default:"All Tours"},
}, {
        timestamps: true
    });
SiteDisplaySchema.plugin(uniqueValidator);
var siteDisplaySchema = mongoose.model('SiteDisplaySchema', SiteDisplaySchema);

module.exports = siteDisplaySchema;


