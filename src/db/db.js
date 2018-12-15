var mongoose = require("mongoose");

var Path = new mongoose.Schema({
    element: {
        type: String
    },
    path: {
        type: String
    },
    coll: {
        type: String
    },
    level: {
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
    label: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    _schema: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    mongo_schema: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    element_path: [Path],
    platform: {
        type: Boolean,
        default: false
    }
});

var db_collection = mongoose.model("db_collection", Schema);
module.exports = db_collection;
