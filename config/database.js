const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{
    console.log("Successfully connected to MongoDb");
})
.catch((error)=>{
    console.log("databse connection failed");
    console.error(error);
    process.exit(1);
});