const mongoose = require('mongoose');
const Joi = require("joi");
const { populate } = require("dotenv");
const { date } = require("joi");

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    signature: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    stock: { type: Number, required: true },
    details: String,
    is_completed: { type: Boolean, default: 0 },
    deleted_at: { type: Date, default: null }
});

module.exports = mongoose.model("Order", orderSchema);
