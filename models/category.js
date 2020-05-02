const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uniqueValidator = require('mongoose-unique-validator')
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const CategorySchema = mongoose.Schema({
    name: String,
    imageUrl:String,
    displayName:String,
    isDeleted:{type:Boolean,default:false},
    headerDisplay:{type:String,default:"-"}
}, {
        timestamps: true
    });
CategorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', CategorySchema);


