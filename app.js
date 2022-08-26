const express = require('express');
const app= express();
const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const path = require('path');
const alerts = require('alert');
const cookieParser = require('cookie-parser');

require("dotenv").config();

require("./config/database");
const User = require("./model/user");
const authentication = require('./middleware/authentication');
const authorization = require('./middleware/authorization');

const port = process.env.PORT || 3333;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));

//Display Landing Page
app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Display Register Page
app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/register.html'));
});

//Perform Registration in Database
app.post("/register", async (req, res)=>{
    try{
        const {firstName, lastName, email, password, confirmpassword}=req.body;
        const useremail = await User.findOne({email:req.body.email});
        if(useremail){
            alerts("email is already in use. Please try to use a different email");
            res.sendFile(path.join(__dirname, '/public/register.html'));
        }else{
            if(password === confirmpassword){
                const salt=await bcrypt.genSalt(10);
                const hashedpassword=await bcrypt.hash(password, salt);
                const registerUser = new User({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: hashedpassword,
                });
                const registered = await registerUser.save();
                res.status(201).sendFile(path.join(__dirname, '/public/login.html'));
            }else{
                alerts("Both passwords aren't matching");
                res.sendFile(path.join(__dirname, '/public/register.html'));
            }
        }
    }catch(e){
        res.status(400).send(e);
    }
});

//Display Login Page
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

//Perform Login
app.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        if(!(email && password)){
            res.status(400).redirect('/login');
        }else{
            const findUser = await User.findOne({email});
            if(findUser && await( bcrypt.compare(password,findUser.password))){
                const token = jwt.sign(
                    {user_id:findUser.id,email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "1h",
                    }
                );
                return res
            .cookie("access_token",token,{
                httpOnly: true,
            })
            .status(200)
            .json({message: "Logged in" });
            }else{
                res.redirect("/login");
            }
        }
    }catch(e){
        console.log(e);
    }
});

//Perform Logout
app.get('/logout', authentication, (req,res)=>{
    return res
    .clearCookie("access_token")
    .status(200)
    .redirect('/');
});

//only for logged in users
app.get("/protected", authentication, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/protected.html'));
});

//only for users with admin role
app.get("/admin",authentication, authorization, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin.html'));
});

app.listen(port,function(){
    console.log("listening on port " + port);
});
