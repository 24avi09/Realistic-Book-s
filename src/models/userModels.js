//---------------------------------------importing modules--------------------------------------------
const mongoose = require("mongoose")

//----------------------------------------Creating Schema---------------------------------------------

const userSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:true,
        enum:["Mr","Mrs","Miss"] ,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true

    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        default: false,
        unique: true

    },
    password:{
        type: String,
        required:true
    },
    address:{
        street: {type:String},
        city: {type:String},
        pincode: {type:String}
    },
    

     
 },{ timestamps: true });


//---------------------------------- exporting all the model here--------------------------------------

module.exports = mongoose.model("User", userSchema);