var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    domain: {
        type: String
    },
    class: {
        type: String
    },
    user_name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    first_name: {
        type: String,
        required: false,
        trim: true
    },
    last_name: {
        type: String,
        required: false,
        trim: true
    },
    user_type: {
        type: String,
        required: true,
        trim: true,
        default: "Client"
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

var user = mongoose.model('user', Schema);
module.exports = user;
