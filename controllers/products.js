const Product = require("../models/products");
const Admin = require("../models/admins");
const Joi = require("joi");
const mongoose = require("mongoose");
const response = require("../helpers/responseApi");



exports.index = async (req, res, next) => {
    try{
        const result = await Product.find().select("name signature stock details price deletedAt createdAt avatar _id")
            .populate('signature', "name email role _id")

        if(result.length){
            res.status(200).json({
                data: response.success('All Products fetched!',result,200)
            })
        }
        else{
            res.status(200).json({
                data: response.error('No products Exist!',200)
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
        console.log('=> ',req.file)
        const admin = await Admin.findOne({ _id: req.body.signature })
            if (!admin) {
                return res.status(400).json({
                    message: "Invalid Id provided for admin Signature."
                });
            } else {
                const product = new Product({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    signature: req.body.signature,
                    stock: req.body.stock,
                    details: req.body.details,
                    price: req.body.price,
                    avatar: req.file.path,
                    searchable: {
                        name: req.body.name,
                        details: req.body.details,
                        seller: req.body.seller
                    }
                });
                const result = await product.save()
                if(result){
                    res.status(200).json({
                        data: response.success('Product Created Successfully',result,200)
                    });
                }
                else{
                    res.status(400).json({
                        data: response.error('No Users could be Added!',400)
                    })
                }
            }
        }
    catch(error){
            res.status(400).json({
                data: response.error(error,400)
            })
        }
};

exports.update = async (req,res, next) => {
    try{
        bcrypt.hash(req.body.password,10, async (err,hash)=>{
            if (err){
                return res.status(400).json({error:err});
            }
            else{
                const result = await Product.updateOne({_id: req.params.id},{ $set: {
                        name: req.body.name,
                        email: req.body.email,
                        phone_number: req.body.phone_number,
                        password: hash,
                        role: req.body.role
                    }});

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
        })
    }
    catch(error){
        res.status(500).json({
            error: response.error(error,500)
        })
    }
}

exports.remove = async (req,res) => {
    try{
        const result = await Product.updateOne({_id: req.params.id},{ $set: {
                deletedAt: Date.now(),
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
        console.log('=> '.req)
        const result = await Product.deleteOne({_id:req.params.id})
        console.log('=> '.result)
        if(result.deletedCount>0){
            res.status(200).json(
                response.success("User Deleted Successfully!",result,200));
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

exports.search = async (req, res) => {
    try {
        const queryValue = req.query.query ?? "";

        if (!queryValue) {
            return res.status(400).json(response.error("Query value is required.", 400));
        }

        // const searchConditions = Object.keys(Product.schema.paths)
        //     .filter(field => field !== '_id' && field !== '__v') // Exclude fields that should not be searched
        //     .map(field => {
        //         const fieldType = Product.schema.paths[field].instance;
        //         switch (fieldType) {
        //             case 'String':
        //                 return { [field]: { $regex: new RegExp(queryValue, 'i') } }; // Case-insensitive regex search for strings
        //             case 'ObjectId':
        //                 // Check if queryValue can be a valid ObjectId
        //                 if (/^[0-9a-fA-F]{24}$/.test(queryValue)) {
        //                     return { [field]: queryValue };
        //                 }
        //                 return undefined; // Skip this field if the input is not a valid ObjectId
        //             case 'Number':
        //                 const number = parseFloat(queryValue);
        //                 return !isNaN(number) ? { [field]: number } : undefined;
        //             case 'Boolean':
        //                 const boolValue = queryValue.toLowerCase() === 'true' ? true : queryValue.toLowerCase() === 'false' ? false : undefined;
        //                 return boolValue !== undefined ? { [field]: boolValue } : undefined;
        //             case 'Date':
        //                 // Attempt to parse date and create condition if successful
        //                 const date = new Date(queryValue);
        //                 return !isNaN(date.valueOf()) ? { [field]: date } : undefined;
        //             default:
        //                 // For other types, direct equality might be attempted
        //                 return { [field]: queryValue };
        //         }
        //     })
        //     .filter(condition => condition !== undefined); // Filter out undefined conditions

        const searchConditions = [
            { "searchable.name": { $regex: new RegExp(queryValue, 'i') } },
            { "searchable.details": { $regex: new RegExp(queryValue, 'i') } },
            { "searchable.seller": { $regex: new RegExp(queryValue, 'i') } }
        ];

        const result = await Product.find({
            $or: searchConditions
        });

        if (result.length > 0) {
            res.status(200).json(response.success("Search results:", result, 200));
        } else {
            res.status(404).json(response.error(`No entry found matching query: ${queryValue}`, 404));
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json(response.error('Internal server error', 500));
    }
};


