const Orders = require("../models/orders");
const Users = require("../models/users");
const Products = require("../models/products");
const Joi = require("joi");
const mongoose = require("mongoose");


exports.index = (req, res, next) => {
    Orders.find().select("name signature stock details deletedAt  _id")
        .populate('signature', "name email role _id")
        .populate('product', "name detail stock deletedAt avatar _id")
        .exec(
            //
        ).then((doc)=>{
        console.log(doc);
        const pendingOrders = doc.filter(order => !order.is_completed);
        const completedOrders = doc.filter(order => order.is_completed);

        const responseData = {
            pending: pendingOrders,
            completed: completedOrders
        };

        if(doc.length){
            res.status(200).json({
                code: 200,
                total_pending: completedOrders.length,
                total_completed: pendingOrders.length,
                total: doc.length,
                data: {
                    completed: completedOrders,
                    pending: pendingOrders
                }
            });
        }
        else{
            res.status(404).json({
                message:"No Orders Exists!"
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
        product: Joi.string().min(8).required(),
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


    Products.find({ _id: req.body.product })
        .exec()
        .then(product => {
            if (product.length === 0) {
                console.log("doc", product);
                return res.status(400).json({
                    message: "Invalid Product Id provided."
                });
            } else {
                const order = new Orders({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    signature: req.params.id,
                    product: req.body.product,
                    stock: req.body.stock,
                    details: req.body.details
                });
                order.save().then(result => {
                    console.log('result=> ', result);
                    return res.status(201).json({ code: 201, "message": 'Order Made Successfully', "order":{ data: result }  });
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
        stock: Joi.number().required(),
        details: Joi.string(),
        product: Joi.string().min(8).required(),
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

    Orders.updateOne({_id: req.params.id},{ $set: {
            stock: req.body.stock,
            details: req.body.details,
            product: req.body.product,
            is_completed: req.body.is_completed,
        }}).exec(
    ).then((doc)=>{
        console.log('doc=> ',doc);
        if(doc.matchedCount>0 && doc.modifiedCount>0){
            res.status(200).json({
                code: 200,
                message : "successfully updated! "
            });
        }
        else if(doc.matchedCount==0){
            console.log('doc=> ',doc)
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

    Orders.updateOne({_id: req.params.id},{ $set: {
            deleted_at: Date.now(),
        }}).exec(
    ).then((doc)=>{
        console.log('doc=> ',doc);
        if(doc.matchedCount>0 && doc.modifiedCount>0){
            res.status(200).json({
                code: 200,
                message : "successfully soft deleted! "
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
    Orders.deleteOne({_id:req.params.id}).exec(
        //
    ).then((doc)=>{
        console.log(doc);
        if(doc.deletedCount>0){
            res.status(200).json({
                code: 200,
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