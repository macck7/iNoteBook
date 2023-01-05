const mongoose = require('mongoose');
require('dotenv').config()

const monngoURI = process.env.URL

const connectToMongo =()=>{
    mongoose.connect(monngoURI,()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;
