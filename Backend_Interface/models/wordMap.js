//Dependencies: 
const mongoose = require('mongoose'); 

//Schema for Tweet Model: 

const Schema = mongoose.Schema;

const wordMapSchema = new Schema({
    wordMap: {}, 
    killSwitch: {
        type: String, 
        default: 'kill',
    },
    representation: {
        type: String,
    }
});

const wordMap = mongoose.model('Maps', wordMapSchema); 

module.exports = wordMap; 

/*
 *An object of words created through mining tweets off of twitter and processing them into numbers. 
 *The numbers represent the frequency of occurence of words in the mined tweets. 
 *These word-frequency pairs are captured in this wordMap model and used for further operations in data processing. 
 *The readMe file contains further information on this process.  
 */