const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uniqueValidator = require('mongoose-unique-validator')
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const TourSchema = mongoose.Schema({
    name: {type:String},
    displayName:{type:String},
    description:String,
    itinerary:String,
    inclusions:[{type: String}],
    thumbnailImage:String,
    imageGallery:[{type:String}],
    labels:[{type:String}],
    highlights:[{type:String}],
    priority:{type:Number,default:0},
    duration:String,
    numerical:String,
    price:String,
    isDeleted:{type:Boolean,default:false},
    approved:{type:Boolean,default:false},
    location:String,
    exclusions:[{type: String}],
    images: [{type: String}],
    popular:{type:Boolean,default:false},
    faq:String,
    pricingtype:String,
    category: { type: ObjectId, ref: 'category',required:true },
    categoryName:String
}, {
        timestamps: true
    });
//TourSchema.plugin(uniqueValidator);
var tourSchema = mongoose.model('Tour', TourSchema);

module.exports = tourSchema;


