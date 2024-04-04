const Product = require("../models/products");
const Admin = require("../models/admins");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


exports.index = (req, res, next) => {
    Product.find().select("name signature stock details deleted_at  _id")
        .exec(
            //
        ).then((doc)=>{
        console.log(doc);
        if(doc.length){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({
                message:"No Products Exists!"
            })
        }

    }).catch(err=> {
        console.log(err)
        res.status(500).json({'error':err});
    })
}

exports.create = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        stock: Joi.number().required(),
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

        return res.status(400).send(errors);
    }

    if (resultId.error) { // Use resultId.error here
        resultId.error.details.forEach(item => {
            errors.push(item.message ?? "");
        });

        return res.status(400).send(errors);
    }


    Admin.find({ _id: req.params.id })
        .exec()
        .then(admin => {
            if (admin.length === 0) {
                console.log("doc", admin);
                return res.status(400).json({
                    message: "Invalid Id provided for admin Signature."
                });
            } else {
                const product = new Product({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    signature: req.params.id,
                    stock: req.body.stock,
                    details: req.body.details
                });
                product.save().then(result => {
                    console.log('result=> ', result);
                    return res.status(201).json({ "product": result, "message": 'Product Created Successfully' });
                }).catch(err => {
                    console.log(err);
                    return res.status(400).json({ "message": err });
                });
            }
        });
};

exports.update = (req,res) => {
    const schema = Joi.object({
        id: Joi.string().required()
    })

    const schemaBody = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    })

    const result = schema.validate(req.params);
    const resultBody = schemaBody.validate(req.body);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }

    if(resultBody.error){
        resultBody.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }

    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if (err){
            return res.status(400).json({error:err});
        }
        else{
            Product.updateOne({_id: req.params.id},{ $set: {
                    name: req.body.name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: hash,
                    role: req.body.role
                }}).exec(
            ).then((doc)=>{
                console.log('doc=> ',doc);
                if(doc.matchedCount>0 && doc.modifiedCount>0){
                    res.status(200).json({
                        message : "successfully updated! "
                    });
                }
                else if(doc.matchedCount>0){
                    res.status(404).json({
                        message:`No entry Exists with ID: ${req.params.id}`
                    })
                }
                else {
                    res.status(404).json({
                        message:`Invalid Request on ID: ${req.params.id}`
                    })
                }

            }).catch(err=> {
                console.log(err)
                res.status(500).json({'error':err});
            })
        }
    })

}

exports.remove = (req,res) => {
    const schema = Joi.object({
        id: Joi.string().required()
    })

    const result = schema.validate(req.params);
    // const resultBody = schemaBody.validate(req.body);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }

            Product.updateOne({_id: req.params.id},{ $set: {
                    deleted_at: Date.now(),
                }}).exec(
            ).then((doc)=>{
                console.log('doc=> ',doc);
                if(doc.matchedCount>0 && doc.modifiedCount>0){
                    res.status(200).json({
                        message : "successfully updated! "
                    });
                }
                else if(doc.matchedCount>0){
                    res.status(404).json({
                        message:`No Product Found with ID: ${req.params.id}`
                    })
                }
                else {
                    res.status(404).json({
                        message:`Invalid Request on ID: ${req.params.id}`
                    })
                }

    //         }).catch(err=> {
    //             console.log(err)
    //             res.status(500).json({'error':err});
    //         })
    //     }
    })

}

exports.delete = (req,res) => {
    const schema = Joi.object({
        id: Joi.string().required()
    })

    const result = schema.validate(req.params);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }
    Product.deleteOne({_id:req.params.id}).exec(
        //
    ).then((doc)=>{
        console.log(doc);
        if(doc.deletedCount>0){
            res.status(200).json({
                message: "Product Deleted Succesfully!"
            });
        }
        else{
            res.status(404).json({
                message:`No entry Exists with ID: ${req.params.id}`
            })
        }

    }).catch(err=> {
        console.log(err)
        res.status(500).json({'error':err});
    })
}