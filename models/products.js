const mongoose = require('mongoose');
const Joi = require("joi");
const { populate } = require("dotenv");
const { date } = require("joi");

const searchableSchema = mongoose.Schema({
    name: {type: String},
    details: String,
    seller: String,
    createdAt: { type: Date, default: Date.now() }
});

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    deletedAt: { type: Date, default: null },
    searchable: searchableSchema
});


productSchema.index({'searchable.name': 1, 'searchable.details': 1, 'searchable.seller': 1}, { unique: true }); //Adding composite key


module.exports = mongoose.model("Product", productSchema);
