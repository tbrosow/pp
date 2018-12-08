var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    type: {
        type: Object,
        required: false,
        trim: true
    },
    active: {
        type: Boolean,
        required: false,
        trim: true
    }
});

var group = mongoose.model('group', Schema);
module.exports = group;
