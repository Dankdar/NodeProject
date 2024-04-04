const mongoose = require('mongoose');
const Joi = require("joi");

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: {
        type: String,
        enum: {
            values: ['Admin', 'Owner'],
            message: '{VALUE} is not supported'
        },
        required: [true, 'role is Required']
    },
    email: {
        type: String,
        // There are two ways for an promise-based async validator to fail:
        // 1) If the promise rejects, Mongoose assumes the validator failed with the given error.
        // 2) If the promise resolves to `false`, Mongoose assumes the validator failed and creates an error with the given `message`.
        validate: {
            validator: () => Promise.resolve(false),
            message: 'Email validation failed'
        },
        required: [true, 'Email is Required']
    },
    name: {
        type: String,
        required: [true, 'role is Required']},
    phone_number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    image: {
        type: String,
        cast: '{VALUE} is not a string'
    },
    is_active: Boolean
})

module.exports = mongoose.model("Admin",adminSchema);