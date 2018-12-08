var mongoose = require('mongoose');

var Section = new mongoose.Schema({
    header:{
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    fields: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "dictionary"
    }]
});

var Column = new mongoose.Schema({
    sections: [Section]
});

var Row = new mongoose.Schema({
    columns: [Column],
});

var Schema = new mongoose.Schema({
    coll: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    view: {
        type: String,
        default: 'default',
        trim: true
    },
    rows: [Row],
    style: Object
});

var FormLayout = mongoose.model('FormLayout', Schema);
module.exports = FormLayout;
