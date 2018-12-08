var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    coll: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    label: {
        type: String,
        required: true
    },
    order: {
        type: Number
    },
    dataType: {
        type: String,
        default: "Text",
        required: true
    },
    dataSubType: {
        type: String,
        default: "text"
    },
    reference: {
        type: String,
        default: "text"
    },
    default: {
        type: String,
        default: ""
    },
    readonly: {
        type: Boolean
    },
    display: {
        type: Boolean,
        default: false
    }
});


var dictionary = mongoose.model('dictionary', Schema);
module.exports = dictionary;
