const mongoose = require('mongoose');

const rutwikSchema = new mongoose.Schema(
{
    userfieldName: { 
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true,
        unique: true
    },
documents : [
{ 
  
   documentfieldName: { 
        type: String,
        required: false,
        unique: false
    
},
  
   random: { 
        type: Number,
        required: false,
        unique: false
    
},
}
],
});

module.exports = mongoose.model('rutwik', rutwikSchema);
