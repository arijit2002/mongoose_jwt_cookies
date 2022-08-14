const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        min:2,
        max:15,
    },
    last_name:{
        type: String,
        required: true,
        min:2,
        max:15,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        min:6,
    },
    password: {
        type: String,
        required: true,
        min: 6
      },
    role: {
        type: String,
        default: 'user',
    }
});

module.exports = mongoose.model("login_user",userSchema);