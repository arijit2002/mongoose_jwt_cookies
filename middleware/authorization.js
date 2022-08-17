const User = require('../model/user')
require("dotenv").config();

const verifyRole = async(req,res,next) => {
    try{
        const decoded=res.locals.user;
        console.log(decoded)
        const findUser =await User.findOne({email:decoded});
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