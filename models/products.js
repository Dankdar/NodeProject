const mongoose = require('mongoose');
const Joi = require("joi");
const { populate } = require("dotenv");
const { date } = require("joi");

const productSchema = mongoose.Schema({
    signature: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    stock: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: String,
    details: String,
    price: {
        type: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now() },
    deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Product", productSchema);
