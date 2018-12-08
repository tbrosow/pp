var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    coll: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    sequence: {
        type: Number,
        default: 1
    },
    digits: {
        type: Number,
        default: 7
    }
});


var sequence = mongoose.model('sequence', Schema);
module.exports = sequence;
