const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Must provide name"],
    },
    userId:{
        type:mongoose.Types.ObjectId,
    },
    permissions:[{
        type:String,
    }],
    roles:[{
        type:mongoose.Types.ObjectId,
    }],
    restrictedRoles:[{
        type:String
    }],
    schemas:[{
        type:mongoose.Types.ObjectId,
    }]

})
module.exports = mongoose.model("Project", schema);