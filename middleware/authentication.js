const jwt=require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return res.sendStatus(403);
    }
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        //console.log(decoded.email);
        return next();
    }catch{
        return res.sendStatus(403);
    }

};

module.exports = verifyToken;