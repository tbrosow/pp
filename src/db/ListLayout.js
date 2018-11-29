var mongoose = require('mongoose');

var Field = new mongoose.Schema({
    name: {
        type: String
    },
    label: {
        type: String
    },
    datatype: {
        type: String
    },
    order: {
        type: Number
    }
});

var Schema = new mongoose.Schema({
    coll: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    // fields: {
    //     type: Array
    // },
    fields: [Field]
});

var ListLayout = mongoose.model('ListLayout', Schema);
module.exports = ListLayout;
