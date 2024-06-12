const mongoose = require('mongoose');

const finalCheckSchema = new mongoose.Schema(
{
Newest : [
{ 
  
   field1: { 
        type: String,
        required: false,
        unique: false
    
},
 field1nest : [
{ 
 field3 : [
{ 
 fields4 : [
{ 
  
   final: { 
        type: Date,
        required: false,
        unique: false
    
},
  
   finlafinal: { 
        type: Boolean,
        required: false,
        unique: false
    
},
  
   last: { 
        type: Decimal128,
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
]
,
}
],
    second: { 
        type: String,
        required: false,
        unique: true
    },
});

module.exports = mongoose.model('finalCheck', finalCheckSchema);
