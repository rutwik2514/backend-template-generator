const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema(
{
    userfieldName: { 
        dataType: String,
        required: true,
        unique: true
    },
    password: { 
        dataType: String,
        required: true,
        unique: true
    },
documents : [
{ 
  
   documentfieldName: { 
        dataType: String,
        required: false,
        unique: false
    
},
  
   random: { 
        dataType: Number,
        required: false,
        unique: false
    
},
}
],
});

module.exports = mongoose.model('login', loginSchema);
