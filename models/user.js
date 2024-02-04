const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    }
},{timestamps:true})
const User = mongoose.model("users",userschema)

module.exports=User;