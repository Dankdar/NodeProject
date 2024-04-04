const mongoose = require('mongoose');
const Joi = require("joi");
const {populate} = require("dotenv");

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignee:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigner:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    details: String,
    priority: String
})

const User = mongoose.model("User",userSchema);
const Admin = mongoose.model("Admin",adminSchema);

module.exports = mongoose.model("Task",taskSchema)