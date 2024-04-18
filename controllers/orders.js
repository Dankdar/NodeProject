const Orders = require("../models/orders");
const Users = require("../models/users");
const Products = require("../models/products");
const Joi = require("joi");
const mongoose = require("mongoose");
const response = require("../helpers/responseApi");
const Product = require("../models/products");


exports.index = async (req, res, next) => {
    try{
        const result = await Orders.find().select("name signature stock details deletedAt  _id")
            .populate('signature', "name email role _id")
            .populate('product', "name detail stock deletedAt avatar _id")
            .populate('signature', "name email role _id")

        const data = {
            'completed Orders' : result.filter(order => order.is_completed).length,
            'pending Orders' : result.filter(order => !order.is_completed).length,
            'total Orders' : result.length,
            'data' : result,
        }

        if(result.length){
            res.status(200).json({
                data: response.success('All Orders fetched!',data,200)
            })
        }
        else{
            res.status(200).json({
                data: response.error('No Orders Exist!',200)
            })
        }
    }
    catch(error){
        res.status(500).json({
            error: response.error(error,500)
        })
    }
}

exports.create = async (req, res, next) => {
    try{
        const resultantProduct = await Products.find({ _id: req.body.product });
        console.log(resultantProduct)
        if(resultantProduct.length === 0){
            res.status(200).json(
                response.success("Invalid Product Id provided.",resultantProduct,200)
            )
        }
        else{
            const order = new Orders({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        signature: req.params.id,
                        product: req.body.product,
                        stock: req.body.stock,
                        details: req.body.details
            });
            const result = await order.save()
            if(result){
                res.status(200).json({
                    data: response.success('Order Created Successfully',result,200)
                });
            }
            else{
                res.status(400).json({
                    data: response.error('No Order could be Added!',400)
                })
            }

        }

    }
    catch(error){
        res.status(500).json({
            error: response.error(error,500)
        })
    }

};

exports.update = async (req,res) => {
    try{
        const result = await Orders.updateOne({_id: req.params.id},{ $set: {
                stock: req.body.stock,
                details: req.body.details,
                product: req.body.product,
                is_completed: req.body.is_completed,
            }})

        if (result.matchedCount > 0 && result.modifiedCount > 0) {
            res.status(200).json(
                response.success("successfully updated! ", result, 200)
            );
        } else if (result.matchedCount > 0){
            res.status(404).json(
                response.error(`No entry Exists with ID: ${req.params.id}`, 404)
            );
        } else {
            res.status(404).json(
                response.error(`Invalid Request on ID: ${req.params.id}`, 404)
            );
        }
    }
    catch(error){
        res.status(500).json({
            error: response.error(error,500)
        })
    }
}

exports.remove = async (req,res) => {
    try{
        const result = await Orders.updateOne({_id: req.params.id},{ $set: {
                deleted_at: Date.now(),
            }})
        if (result.matchedCount > 0 && result.modifiedCount > 0) {
            res.status(200).json(
                response.success("successfully soft deleted! ", result, 200)
            );
        } else if (result.matchedCount > 0) {
            res.status(404).json(
                response.error(`No entry Exists with ID: ${req.params.id}`, 404)
            );
        } else {
            res.status(404).json(
                response.error(`Invalid Request on ID: ${req.params.id}`, 404)
            );
        }
    }
    catch(error){
        res.status(500).json({
            error: response.error(error,500)
        })
    }
}

exports.delete = async (req,res) => {
    try{
        const result = await Orders.deleteOne({_id:req.params.id})
        if(result.deletedCount>0){
            res.status(200).json(
                response.success("Order Deleted Successfully!",result,200));
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