const Admin = require("../models/admins");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


exports.index = (req, res, next) => {
    Admin.find().select("name email role phone_number is_active  _id")
        .exec(
            //
        ).then((doc)=>{
        console.log(doc);
        if(doc.length){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({
                message:"No Admins Exists!"
            })
        }

    }).catch(err=> {
        console.log(err)
        res.status(500).json({'error':err});
    })
}

exports.create = (req,res,next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        phone_number: Joi.string().required(),
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
    console.log("úser=>", req.body)


    Admin.find({email: req.body.email})
        .exec()
        .then(Admin=>{
            if(Admin.length >= 1){
                return res.status(409).json({
                    message: "E-Mail Already Taken"
                });
            }
            else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    if (err){
                        return res.status(400).json({error:err});
                    }
                    else{
                        const Admin = new Admin({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            phone_number: req.body.phone_number,
                            password: hash,
                            role: req.body.role
                        })
                        Admin.save().then(result=> {
                            console.log('result=> ',result);
                            res.status(201).json({
                                "Admin":result,
                                "message":'Admin Created Successfully',
                            })
                        }).catch(err=>{
                            console.log(err)
                            res.status(400).json({
                                "message":err,
                            })
                        })
                    }
                })
            }
        })
}

exports.login = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
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


    Admin.find({ email: req.body.email }).exec().then(Admin =>{
        if(Admin.length<1) {
            return res.status(404).json({
                message:"Email or Password is Incorrect and or Does Not Exist",
                error:"true"
            })
        }
        else{
            bcrypt.compare(req.body.password,Admin[0].password,(err,resp)=>{
                // if(err){
                //     return res.status(401).json({
                //         message:"Incorrect Password or E-Mail."
                //     })
                // }
                if(resp){
                    const token = jwt.sign({
                        email: Admin[0].email,
                        AdminId: Admin[0]._id } , process.env.JWT_KEY, { expiresIn: "3h" });
                    return res.status(200).json({
                        message:"Logged in Successfully.",
                        token: token
                    })
                }
                // return res.status(401).json({
                //     message:"Authorization failed."
                // })
                return res.status(401).json({
                    message:"Incorrect Password or E-Mail."
                })
            })
        }
    })
        .catch(err=>{
            console.log('err=> ',err);
            res.status(500).json({
                message:"Internal Server Error",
                error:err
            })
        })
}

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
            Admin.updateOne({_id: req.params.id},{ $set: {
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

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }
    Admin.deleteOne({_id:req.params.id}).exec(
        //
    ).then((doc)=>{
        console.log(doc);
        if(doc.deletedCount>0){
            res.status(200).json({
                message: "Admin Deleted Succesfully!"
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