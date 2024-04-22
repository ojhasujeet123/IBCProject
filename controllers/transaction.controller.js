const Holders=require('../models/holder.model')
const {getElapsedTime}=require('../utils/auth.utils')
const {Web3 }= require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');
const abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const decoder = new InputDataDecoder(abi); 
require('dotenv').config() 
console.log('process.env.ETHEREUMNODEURL ' , process.env.ETHEREUMNODEURL)
const web3 = new Web3('https://glc-dataseed.thealliance.co.in');
const db = require("../models");
const Transactions = db.transactions;
const CurrentBlock = db.currentBlock;
const cron = require('node-cron');


//comment 
let Scanblock = async( ) => {
    
    const latest = await web3.eth.getBlockNumber() 
    console.log('its latest block ' , latest) 
    let lastBlock = await CurrentBlock.findOne({});
    let i =  lastBlock.blockNumber;
    let endBlock = parseInt(latest);// > (parseInt(i)+ parseInt(200)) ? latest :(i + parseInt(i)+ parseInt(200) ) ;   //(parseFloat(lastBlock.blockNumber) + parseFloat(50)) 
    // endBlock = (endBlock - i) > 200 ? (parseInt(i) + parseInt(200)) : endBlock;
    console.log('now we scan from ' + i + ' to '+ endBlock) 
    for(i; i <  endBlock; i++){ 
        console.log('its i ', i )
        let block = await blockInfo(i) 
        
        if(block.transactions && block.transactions.length > 0){ 
            for(s = 0; s <  block.transactions.length ; s++){ 
                let transaction = block.transactions[s]
                console.log('main transacrtion is ' , transaction) 
                let functionName = '';
                if(transaction.input == '0x'){
                    functionName = ''
                }else{ 
                    const decodeRes = decoder.decodeData(transaction.input);
                    let functionsMethods = []; 
                    for(k = 0; k <  decodeRes.types.length; k++){ 
                        functionsMethods.push(decodeRes.types[k] + ' ' + decodeRes.names[k])
                    } 
                    functionName = decodeRes.method +'('+functionsMethods.join()+')'
                }
                let transactionReceipt = await web3.eth.getTransactionReceipt(transaction.hash);//eth.getTransactionReceipt("0x636b6d5ede1a24d9efeff079a8da5c0b22692419ec01f9afa4653fcc871a00cf")
                console.log('its transaction receipt ' , transactionReceipt.logs)
                let transactionData = {
                    blockNumber:parseInt(transaction.blockNumber),
                    timeStamp:Number(block.timestamp),
                    blockHash:transaction.blockHash,
                    from:transaction.from,
                    to:transaction.to,
                    hash:transaction.hash,
                    value:transaction.value , //web3.utils.fromWei(transaction.value, 'ether'),
                    gas:transaction.gas, 
                    gasPrice:transaction.gasPrice, 
                    nonce : transaction.nonce,
                    transactionIndex : parseInt(transaction.transactionIndex),
                    isError:0,
                    txreceipt_status : 1,
                    input : transaction.input,
                    cumulativeGasUsed : parseInt(transactionReceipt.cumulativeGasUsed),
                    gasUsed : parseInt(transactionReceipt.gasUsed),
                    confirmations : 0,
                    functionName :functionName,
                }


                if(transaction.input != '0x'){
                    if(transaction.input.substr(0,10) == '0xa9059cbb'){
                        const result =decoder.decodeData(transaction.input);// web3.utils.numberToHex(transaction.input); 
                        transactionData.contractAddress = transactionReceipt.logs[0].address;// transaction.input.substr(10,64)
                        transactionData.contractValue = web3.utils.fromWei(transaction.input.substr(74), 'ether');
                        transactionData.methodId = transaction.input.substr(0,10)
                        transactionData.input = transaction.input
                        // console.log('check for contract address ',web3.utils.bytesToHex(transaction.input.substr(10,64)))
                    }else{
                        console.log('its contract creation',transaction.type)
                        transactionData.methodId = '0x';
                    }
                }else{
                    transactionData.methodId = transaction.input;
                    console.log('its normal transaction ')
                } 
                console.log('transaction data ' , transactionData)
                insertTransactions(transactionData); 
                
            }  
        }
        
    }   

    CurrentBlock.updateOne({ "_id": lastBlock._id }, {
        "blockNumber": endBlock,
    }).then(data => {
                console.log('update data ', data)
            }).catch(err => {
                console.log('update err ', err)
            });
 
}
cron.schedule('* * * * *', () => {
    // if(process.env.BASE_URL == 'https://blcscan.org/'){
        Scanblock(); 
    // }
    
});

let insertTransactions = async (transaction) => {
    let transactionExist = await Transactions.findOne({hash : transaction.hash});
    if(!transactionExist){
        // console.log('new transaction data ' , transaction)
        Transactions.create(transaction).then(data => {
            // res.send(data);
            console.log('transaction created')
        })
        .catch(err => {
            console.log('err ',err ) 
        });
    }else{
        console.log('transaction already stored ');
    }
}
let blockInfo = async (blockNumber) => { 
    return await web3.eth.getBlock(blockNumber , true);//.then(console.log);
     
    
}
Scanblock()
const transactionController = {

//GET ALL  TRANSACTION


getAllTransactions: async (req, res, next) => {
    try {
        
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let today_txns = await Transactions.find({ createdAt: { $gte: today, $lt: new Date(today.valueOf() + 86400000) } }).countDocuments()

        const [transactions, totalBlocksNumber, accountHolder, totalTransactions, totalAmountResult] = await Promise.all([
            Transactions.find({})
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit )
                .lean(),
            Transactions.distinct('blockNumber'),
            Holders.countDocuments({}),
            Transactions.countDocuments({}),
            Transactions.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: {
                                $toDecimal: "$value"
                            }
                        }
                    }
                }
            ]).exec(),
        ]);

        const totalBlocks = totalBlocksNumber.length;

        const transactionsIST = transactions.map(transaction => ({
            ...transaction,
            timestamp: getElapsedTime(transaction.timeStamp),
            createdAt: getElapsedTime(transaction.createdAt),
            updatedAt: getElapsedTime(transaction.updatedAt),
        }));

        const totalAmount = totalAmountResult[0]?.totalAmount || 0;

        res.status(200).json({
            today_txns,
            totalAmount,
            totalBlocks,
            accountHolder,
            totalTransactions,
            transactions: transactionsIST
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
},



//Transaction By hash

    // getTransactionByHash: async (req, res, next) => {
    //     try {
    //         const transactionOfSingleUser = await Transactions.findOne({ hash: req.params.hash });

    //         if (!transactionOfSingleUser) {
    //             return res.status(404).json({ message: "Transaction not found for the given hash" });
    //         }

    //         res.status(200).json({ transactionOfSingleUser });
    //     } catch (error) {
    //         console.error(error);
    //         next(error);
    //     }
    // },


    getTransactionByHash: async (req, res, next) => {
        try {
            const transactionOfSingleUser = await Transactions.findOne({ hash: req.params.hash });
    
            if (!transactionOfSingleUser) {
                return res.status(404).json({ message: "Transaction not found for the given hash" });
            }
    
            // Wrap the transaction in an array before sending the response
            res.status(200).json({ transactions: transactionOfSingleUser });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
    





    //GET TRANSACTION BY ADDRESS

    
    getTransactionByAddress: async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            
            const [txnCount,transactions]=await Promise.all([
                await Transactions.find({$or: [{ from: req.params.address }, { to: req.params.address }]}).countDocuments(),
                await Transactions.find({
                        $or: [{ from: req.params.address }, { to: req.params.address }]
                    }).sort({createdAt:-1}).skip(skip).limit(limit)
            ])

            if (!transactions || transactions.length === 0) {
                return res.status(404).json({ message: "Transactions not found for this address" });
            }
            
            const formattedTransactions = transactions.map(transaction => {
                // Assuming createdAt field is a Date object, you can format it using toLocaleString or any other formatting method
                return {
                    ...transaction._doc,
                    createdAt: getElapsedTime(transaction.createdAt) // Assuming formatDate is your formatting function
                };
            });
    
            res.status(200).json({ txnCount,transactionByAddress: formattedTransactions });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },  
    
    // Example formatting function

    
};




module.exports=transactionController




