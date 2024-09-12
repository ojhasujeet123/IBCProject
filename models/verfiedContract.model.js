const mongoose = require('mongoose')


const contractVerifySchema=new mongoose.Schema({
    contractAddress:String,
    contractBytecode:String,
    abi:String,
    object:String,
    opcodes:String,
    sourceMap:String
})

const verifiedContract = mongoose.model("verifiedContract",contractVerifySchema)

module.exports=verifiedContract;