var mongoose = require('mongoose');

var Menu = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },value: {
        type: String,
        required: true,
        trim: true
    },active: {
        type: Boolean,
        unique: false,
        required: true,
        default: true
    }
});

var Schema = new mongoose.Schema({
    coll: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    field: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    menus: [Menu]
});


var Menu = mongoose.model('Menu', Schema);
module.exports = Menu;

