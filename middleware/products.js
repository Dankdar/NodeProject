// const Task = require("../models/tasks");
const Joi = require("joi");
const express = require("express");
const response = require("../helpers/responseApi");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.validateProduct = (req,res,next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        stock: Joi.number().required(),
        price: Joi.number().required(),
        details: Joi.string(),
    });

    const schemaId = Joi.object({
        id: Joi.string().min(8).required(),
    });

    const result = schema.validate(req.body);
    const resultId = schemaId.validate(req.params); // Use schemaId here

    const errors = [];
    if (result.error) {
        result.error.details.forEach(item => {
            errors.push(item.message);
        });

        res.status(400).json(response.error(errors,400));
    }

    if (resultId.error) { // Use resultId.error here
        resultId.error.details.forEach(item => {
            errors.push(item.message ?? "");
        });

        res.status(400).json(response.error(errors,400));
    }
}