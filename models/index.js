

const mongoose=require("mongoose")
let mongourl = 'mongodb+srv://gtcscan:Xxz483OZQ16oF759@db-mongodb-sgp1-84853-9ffebb5c.mongo.ondigitalocean.com/blcscan?tls=true&authSource=admin&replicaSet=db-mongodb-sgp1-84853';


async function db(){
    try{
        await mongoose.connect(mongourl
         );
        console.log("Database Connected Successfully");
    }catch(error){
        console.error("Failed to connect Database")
    }
}
db.user = require("./user.model.js") 
db.transactions = require("./transactions.model.js") 
db.currentBlock = require("./currentBlock.model.js") 
db.api_key = require("./apikey.model.js")

module.exports=db;