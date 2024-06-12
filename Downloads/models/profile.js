const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Must provide Email"],
        unique: [true, "Email should be unique."]
    },
    password: {
        type: String,
        required: [true, "Must provide password"],
        minlength: [6, "Length of password should be atleast 6 characters."]
    },
    userType:{
        type:String,
        required: [true, "Must provide user type"],
    }
})
module.exports = mongoose.model("Profile", schema);