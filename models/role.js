const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Must provide name"],
    },
    projectId:{
        type:mongoose.Types.ObjectId,
    },
    permissions:[{
        type:String,
    }],
})
module.exports = mongoose.model("Role", schema);