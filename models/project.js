const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Must provide name"],
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"Profile"
    },
    permissions:[{
        type:String,
    }],
    roles:[{
        type:mongoose.Types.ObjectId,
        ref:"Role"
    }],
    schemas:[{
        type: mongoose.Types.ObjectId,
        ref: "schemas"
    }]

})
module.exports = mongoose.model("Project", schema);