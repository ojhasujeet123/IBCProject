const mongoose=require("mongoose")
require('dotenv').config();

let mongourl=process.env.MONGOURL
console.log("mongourl",mongourl);



async function db(){
    try{
        await mongoose.connect(mongourl,
        );
        console.log("Database Connected Successfully");
    }catch(error){
        console.error("Failed to connect Database",error)
    }
}
db.user = require("./user.model.js") 
db.transactions = require("./transactions.model.js") 
db.currentBlock = require("./currentBlock.model.js") 
db.api_key = require("./apikey.model.js")
db.holder=require('./holder.model.js')
db.contractVerify=require('./verfiedContract.model.js')

module.exports=db;