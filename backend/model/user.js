const mongoose = require("mongoose")


//model
const userSchema = mongoose.Schema({
    name : {type : String ,  required : true},
    email : {type : String ,  required : true},
    password : {type : String ,  required : true},
    profession : {type : String ,  required : false},
    phoneNo : {type : String ,  required : false},
})

const User = mongoose.model("User" , userSchema)

module.exports = User