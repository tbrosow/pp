var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    user_name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: true,
        trim: true
    }
});

var User = mongoose.model('User', Schema);
module.exports = User;
