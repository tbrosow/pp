var mongoose = require('mongoose');
var dictionary = require('./dictionary')

// var Field = new mongoose.Schema({
//     name: {
//         type: String
//     },
//     label: {
//         type: String
//     },
//     dataType: {
//         type: String
//     },
//     order: {
//         type: Number
//     }
// });

var Schema = new mongoose.Schema({
    coll: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    view: {
        type: String,
        default: 'default'
    },
    fields: [
        {
            order: {
                type: Number
            },
            active: {
                type: Boolean
            },
            ref: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "dictionary"
            }
        }
    ]
});

var ListLayout = mongoose.model('ListLayout', Schema);
module.exports = ListLayout;
