var mongoose = require("mongoose");

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  domain: {
    type: String
  },
  class: {
    type: String
  }
});

var core = mongoose.model("core", Schema);
module.exports = core;
