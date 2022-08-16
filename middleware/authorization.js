const User = require('../model/user')
const jwt=require("jsonwebtoken");
require("dotenv").config();

const verifyRole = async(req,res,next) => {
    const token = req.cookies.access_token;
    if(!token){
        return res.sendStatus(403);
    }
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log(decoded.email);
        const findUser =await User.findOne({email:decoded.email});
        console.log(findUser);
        if(findUser.role === 'admin') {
            return next();
        }else{
            return res.send("You are not allowed to access this page");
        }
    }catch{
        return res.sendStatus(403);
    }
};

module.exports = verifyRole;