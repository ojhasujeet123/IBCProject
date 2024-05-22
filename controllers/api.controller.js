const db = require("../models");
const Transactions = db.transactions; 
require('dotenv').config();
const {Web3} = require('web3'); 
require('dotenv').config() 
const web3 = new Web3(process.env.ETHEREUMNODEURL)

const validModules = ['account']

const index = (req , res) => {
    let module = req.query.module;
    if(validModules.includes(module)){
        
        if(module == 'account'){
            accountModule(req , res);
        }
        
    }else{
        let resp = {
            status : "0",
            message : 'NOTOK-Missing/Invalid API Key, rate limit of 1/5sec applied',
            "result": "Error! Missing Or invalid Module name"
        }
        res.status(200).send(resp);
    }
}

const accountModule = async( req , res ) => { 
    console.log("inside function");
    if(['balance','balancemulti','txlist'].includes(req.query.action)){
        if(req.query.action == 'balance'){
            if (web3.utils.isAddress(req.query.address)) {
                let balance = await  web3.eth.getBalance(req.query.address);
                let resp = {
                    status : "1",
                    message : 'OK',
                    result: balance.toString()

                    // result: web3.utils.toWei(balance.toString(),"ether")
                }
                res.status(200).json({resp});
            }else { 
                let resp = {
                    status : "1",
                    message : 'NOT/OK',
                    result: 'Error! Invalid address format'
                }
                res.status(200).send(resp);
            }
        }else if(req.query.action == 'balancemulti'){
            let addresses = req.query.address.split(',')
            console.log(addresses)
            let result = [];
            let status = 1; 

            for (const address of addresses) {
                console.log("address=========>",address);
                if(web3.utils.isAddress(address)){
                    result.push({account : address , balance : (await  web3.eth.getBalance(address)).toString()});
                    console.log("result=====>",result);
                }else{
                    status = 0;
                }
            }
            if(status == 1){
                let resp = {
                    status : "1",
                    message : 'OK',
                    result: result
                }
                res.status(200).send(resp);
            }else{
                let resp = {
                    status : "0",
                    message : 'NOT/OK',
                    result: 'Error! Invalid address format'
                }
                res.status(200).send(resp);
            }
        }else if(req.query.action == 'txlist'){
            txlist(req , res)
        }
    }else{
        let resp = {
            status : "0",
            message : 'NOTOK-Missing/Invalid API Key, rate limit of 1/5sec applied',
            result: "Error! Missing Or invalid Action name"
        }
        res.status(200).send(resp);
    }
} 

const txlist = async (req  , res) => {
    let address = req.query.address;
    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.offset ? req.query.offset : 30;  
    let sort = req.query.sort ? req.query.sort : 'desc';  
    console.log('params ' , req.query)
    try{

        let transactions =  await Transactions.find({$or: [{ 'from': address }, { 'to': address }] })
                                                .sort({"_id":-1})
                                                .limit(limit)
                                                .skip(parseInt((page) * limit));
            console.log('transactions.length ' , transactions.length)
            res.status(200).send({
                status : "1",
                message : 'OK',
                result: transactions,
            }); 
            
    }catch(e){
        console.log('transactions ' , e)
        res.status(200).send({
            status : "0",
            message : 'NOT/OK',
            result: e,
        }); 
    }
    
   
}

module.exports = {
    index : index
}