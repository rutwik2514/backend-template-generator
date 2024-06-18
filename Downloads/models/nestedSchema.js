const mongoose = require('mongoose');

const NestedSchema = new mongoose.Schema(
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
 Nest : [
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
]
,
}
]
,
}
],
});

module.exports = mongoose.model('Nested', NestedSchema);
