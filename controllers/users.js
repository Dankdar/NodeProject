const User = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const response = require("../helpers/responseApi");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const usersMiddleware = require('../middleware/users');
const {validate_user} = require("../middleware/users");
const Order = require("../models/orders");


exports.index = async (req, res, next) => {
        try {
            // Reset is_completed to 0 for all tasks
            const users = await User.find().select("name email role phoneNumber isActive _id createdAt");
            if(users.length){
                res.status(200).json({
                    data: response.success('Success',users,200)
                });
            }
            else{
                res.status(200).json({
                    data: response.error('No Users Exists!',200)
                })
            }

        } catch (error) {
            res.status(500).json({
                error: response.error(error,500)
            })
        }
}

exports.create = async (req,res,next) => {
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required(),
    //     email: Joi.string().min(3).required(),
    //     phone_number: Joi.string().required(),
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
    // console.log("úser=>", req.body)
    //

    try{
        const user = await User.findOne({email: req.body.email});
        if(user){
            res.status(409).json({
                data: response.error('E-Mail Already Taken!',409)
            })
        }
        else{
            bcrypt.hash(req.body.password,10,async (err, hash) => {
                if (err) {
                    res.status(400).json({
                        data: response.error(err, 400)
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        phone_number: req.body.phone_number,
                        password: hash,
                        role: req.body.role
                    })

                    const result = await user.save()
                    if (result._id) {
                        res.status(201).json({
                            data: response.success('User Created Successfully', user, 201)
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
        res.status(400).json({
            data: response.error(error,400)
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
        const user= await  User.findOne({ email: req.body.email });
        if(!user) {
            res.status(404).json({
                data: response.error("Email or Password is Incorrect and or Does Not Exist",404)
            })
        }
        else{
            bcrypt.compare(req.body.password,user.password,(err,resp)=>{
                if(err){
                    res.status(401).json({
                        data: response.error("Incorrect Password or E-Mail.",401)
                    })
                }
                if(resp){
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id } , process.env.JWT_KEY, { expiresIn: "3h" });
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

exports.update = async (req, res, next) => {
    // const schema = Joi.object({
    //     id: Joi.string().required()
    // })
    //
    // const schemaBody = Joi.object({
    //     name: Joi.string().min(3).required(),
    //     email: Joi.string().min(3).required(),
    //     phone_number: Joi.string().required(),
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
                const user = await User.updateOne({_id: req.params.id}, {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        phone_number: req.body.phone_number,
                        password: hash,
                        role: req.body.role
                    }
                })
                if (user.matchedCount > 0 && user.modifiedCount > 0) {
                    res.status(200).json(
                        response.success("successfully updated! ", user, 200)
                    );
                } else if (user.matchedCount > 0) {
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

exports.remove = async (req,res) => {
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
       const user = await User.deleteOne({_id:req.params.id})
        if(user.deletedCount>0){
            res.status(200).json(
                response.success("User Deleted Successfully!",user,200));
        }
        else{
            res.status(404).json(response.error(`No entry Exists with ID: ${req.params.id}`,404))
        }
    }
    catch(error){
        res.status(500).json(
          response.error(error,500)
        );
    }
}


