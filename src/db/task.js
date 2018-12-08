var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    number: {
        type: String,
        // unique: true,
        required: false,
        trim: true
    },
    task_type: {
        type: String,
        required: true,
        trim: true,
        default: "task"
    },
    active: {
        type: Boolean,
        required: false,
        trim: true,
        default: true
    },
    major: {
        type: Boolean,
        required: false,
        trim: true,
        default: true
    },
    closed: {
        type: Boolean,
        required: false,
        trim: true,
        default: true
    },
    state: {
        type: String,
        required: true,
        trim: true,
        default: "new"
    },
    short_description: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        required: true,
        trim: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        trim: true
    },
    assignment_group: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        trim: true
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    sys: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "core"
    }
});

var task = mongoose.model('task', Schema);
module.exports = task;
