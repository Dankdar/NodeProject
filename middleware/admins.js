// const Task = require("../models/tasks");
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.validate_user = (res,req,next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        phone_number: Joi.number().required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    })
    const result = schema.validate(req.body);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }
    else{
        next();
    }
}

exports.validate_login = (res,req,next) => {
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
        phone_number: Joi.number().required(),
        password: Joi.string().required()
    })
    const result = schema.validate(req.body);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }
    else{
        next();
    }
}