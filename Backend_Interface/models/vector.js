//Dependencies: 
const mongoose = require('mongoose'); 

//Schema for Tweet Model: 

const Schema = mongoose.Schema;

const inputVectorSchema = new Schema ({
    vector: [Number], 
    label: String, 
    killSwitch: {
        type: String, 
        default: 'kill', 
    },
})

const Vector = mongoose.model('vector', inputVectorSchema); 

module.exports = Vector; 

/*
 *Mongoose model used to allow creation, storage, and retrieval of input vectors to the relevant database conneciton.  
 */