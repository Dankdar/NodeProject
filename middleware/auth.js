const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        // console.log(req.headers);
        // return "";
        req.userData = jwt.verify(token, process.env.JWT_KEY);
        // console.log(jwt.verify(token, process.env.JWT_KEY));
        // if(decoded){
        //     //
            next();
        // }
    }
    catch{
        return res.status(401).json({
            message: "Authorization Failed."
        })
    }
};