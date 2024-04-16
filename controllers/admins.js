const Admin = require("../models/admins");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const response = require("../helpers/responseApi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/users");


exports.index = async (req, res, next) => {
    try{
        const admin = await Admin.find().select("name email role phoneNumber isActive _id createdAt")
        if(admin){
            res.status(200).json(response.success('fetched all users',admin,200));
        }
        else{
            res.status(404).json({
                message:"No Admins Exists!"
            })
        }
    }
    catch(error){
        res.status(500).json({
            error: error
        });
    }
}

exports.create = async (req,res,next) => {
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required(),
    //     email: Joi.string().min(3).required(),
    //     phoneNumber: Joi.string().required(),
    //     password: Joi.string().required(),
    //     role: Joi.string().required()
    // })
    // const result = schema.validate(req.body);
    //
    // const errors = [];
    // if(result.error){
    //     result.error.details.forEach(item => {
    //         errors.push(item.message);
    //     })
    //
    //     res.status(400).send(errors);
    // }

    try{
        const admin = await Admin.findOne({email: req.body.email})
        if(admin){
            return res.status(409).json({
                message: "E-Mail Already Taken"
            });
        }
        else{
            bcrypt.hash(req.body.password,10,async (err,hash)=>{
                if (err){
                    return res.status(400).json({error:err});
                }
                else{
                    const admin = new Admin({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        password: hash,
                        role: req.body.role
                    })
                    const result = await admin.save()
                    if (result._id) {
                        res.status(201).json({
                            data: response.success('Admin Created Successfully', result, 201)
                        })
                    } else {
                        res.status(409).json({
                            data: response.error(err, 409)
                        })
                    }
                }
            })
        }
    }
    catch(error){
        res.status(500).json({
            error: response.error(error,500)
        })
    }
}

exports.login = async (req, res, next) => {
    // const schema = Joi.object({
    //     email: Joi.string().min(3).required(),
    //     password: Joi.string().required()
    // })
    // const result = schema.validate(req.body);
    //
    // const errors = [];
    // if(result.error){
    //     result.error.details.forEach(item => {
    //         errors.push(item.message);
    //     })
    //
    //     res.status(400).send(errors);
    // }

    try{
        const admin= await  Admin.findOne({ email: req.body.email });
        if(!admin) {
            res.status(404).json({
                data: response.error("Email or Password is Incorrect and or Does Not Exist",404)
            })
        }
        else{
            bcrypt.compare(req.body.password,admin.password,(err,resp)=>{
                if(err){
                    res.status(401).json({
                        data: response.error("Incorrect Password or E-Mail.",401)
                    })
                }
                if(resp){
                    const token = jwt.sign({
                        email: admin.email,
                        userId: admin._id } , process.env.JWT_KEY, { expiresIn: "3h" });
                    return res.status(200).json({
                        message:"Logged in Successfully.",
                        token: token
                    })
                }
                res.status(401).json({
                    data: response.error("Incorrect Password or E-Mail.",401)
                })
            })
        }
    }
    catch(error){
        res.status(500).json({
            data: response.error(error,500)
        })
    }
}

exports.update = async (req,res,next) => {
    // const schema = Joi.object({
    //     id: Joi.string().required()
    // })
    //
    // const schemaBody = Joi.object({
    //     name: Joi.string().min(3).required(),
    //     email: Joi.string().min(3).required(),
    //     phoneNumber: Joi.string().required(),
    //     password: Joi.string().required(),
    //     role: Joi.string().required()
    // })
    //
    // const result = schema.validate(req.params);
    // const resultBody = schemaBody.validate(req.body);
    //
    // const errors = [];
    // if(result.error){
    //     result.error.details.forEach(item => {
    //         errors.push(item.message);
    //     })
    //
    //     res.status(400).send(errors);
    // }
    //
    // if(resultBody.error){
    //     resultBody.error.details.forEach(item => {
    //         errors.push(item.message);
    //     })
    //
    //     res.status(400).send(errors);
    // }

    try{
        // console.log(req);
        // console.log(req.body);
        bcrypt.hash(req.body.password,10,async (err, hash) => {
            if (err) {
                // return res.status(400).json({error:err});
                res.status(400).json(response.error(err, 400));
            } else {
                const admin = await Admin.updateOne({_id: req.params.id}, {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        password: hash,
                        role: req.body.role
                    }
                })
                if (admin.matchedCount > 0 && admin.modifiedCount > 0) {
                    res.status(200).json(
                        response.success("successfully updated! ", admin, 200)
                    );
                } else if (admin.matchedCount > 0) {
                    res.status(404).json(
                        response.error(`No entry Exists with ID: ${req.params.id}`, 404)
                    );
                } else {
                    res.status(404).json(
                        response.error(`Invalid Request on ID: ${req.params.id}`, 404)
                    );
                }
            }
        })
    }
    catch(error){
        res.json(response.error(error,400))
    }

}

exports.remove = async (req,res, next) => {
    // const schema = Joi.object({
    //     id: Joi.string().required()
    // })
    //
    // const result = schema.validate(req.params);
    //
    // const errors = [];
    // if(result.error){
    //     result.error.details.forEach(item => {
    //         errors.push(item.message);
    //     })
    //
    //     res.status(400).send(errors);
    // }

    try{
        const result = await Admin.updateOne({_id: req.params.id},{ $set: {
                deletedAt: Date.now(),
            }})
        if(result.matchedCount>0 && result.modifiedCount>0){
            res.status(200).json(
                response.success("successfully soft deleted!  ", result, 200)
            );
        }
        else if(result.matchedCount>0){
            res.status(404).json(
                response.error(`No entry Exists with ID: ${req.params.id}`, 404)
            );
        }
        else {
            res.status(404).json(
                response.error(`Invalid Request on ID: ${req.params.id}`, 404)
            );
        }
    }
    catch(error){
        res.json(response.error(error,400))
    }

}

exports.delete = async (req,res) => {
    // const schema = Joi.object({
    //     id: Joi.string().required()
    // })
    //
    // const result = schema.validate(req.params);
    //
    // const errors = [];
    // if(result.error){
    //     result.error.details.forEach(item => {
    //         errors.push(item.message);
    //     })
    //
    //     res.status(400).send(errors);
    // }

    try{
        const result = await Admin.deleteOne({_id:req.params.id})
        if(result){
            if(result?.deletedCount>0){
                res.status(200).json(response.success("Successfully removed",result,200));
            }
            else{
                res.status(404).json(response.error(`No entry Exists with ID: ${req.params.id}`,404))
            }
        }
    }
    catch(error){
        res.status(500).json(
            response.error(error, 500)
        );
    }
}