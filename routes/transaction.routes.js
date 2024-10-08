const express=require('express')
const router=express.Router()
const transactionController=require('../controllers/transaction.controller')
const {tokenTransaction,getTransactionForChart, contactquery, accounts,blocks,getBlockDetails,avgBlockSize,deployedBytecode}=require('../controllers/main.controller')
const{index}=require('../controllers/api.controller')
// const {contractVerify} = require('../ignition/modules/contractVerify')
const {contractVerify} =require('../src/compareBYtecode')
router.get('/tokentxns',tokenTransaction)
// const {updateHoldersBalances} = require("../controllers/transaction.controller")

router.get('/transaction',transactionController.getAllTransactions)
router.get('/transaction/chart',getTransactionForChart)
router.get('/transaction/hash/:hash',transactionController.getTransactionByHash)
router.get('/transaction/address/:address',transactionController.getTransactionByAddress)
 

router.post('/bytecode',deployedBytecode)
router.post('/query',contactquery)
router.get('/accounts',accounts)
router.get('/blocks',blocks)
router.get('/blocks/blocknum/:blocks',getBlockDetails)
router.get('/txn/blockavg',avgBlockSize)
// router.get('/blocks/blocknum/:blocks/txn',blockTxn)

// router.post('/updateholder',updateHoldersBalances)

router.get('/index',index)
router.post('/contractVerify',contractVerify)



module.exports=router