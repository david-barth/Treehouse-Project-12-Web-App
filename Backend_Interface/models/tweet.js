//Dependencies: 
const mongoose = require('mongoose'); 

//Schema for Tweet Model: 

const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    text: {
        type: String,   
    }, 

    label: {
        type: String, 
    }, 

    location: {
        type: String,
        default: 'Independent',
    }, 
})


const tweet = mongoose.model('Tweet', tweetSchema); 

module.exports = tweet; 