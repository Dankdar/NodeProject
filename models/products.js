const mongoose = require('mongoose');
const Joi = require("joi");
const { populate } = require("dotenv");
const { date } = require("joi");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    signature: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    stock: {
        type: Number,
        required: true // Moved outside the 'stock' object
    },
    name: {
        type: String,
        required: true
    },
    avatar: String,
    details: String,
    deleted_at: { type: Date, default: null }
});

module.exports = mongoose.model("Product", productSchema);
