const express=require('express')
const router=express.Router()
const transactionController=require('../controllers/transaction.controller')
const {tokenTransaction,getTransactionForChart, contactquery, accounts,blocks,blockDetailByBlockNumber}=require('../controllers/main.controller')

router.get('/tokentxns',tokenTransaction)

router.get('/transaction',transactionController.getAllTransactions)
router.get('/transaction/chart',getTransactionForChart)
router.get('/transaction/hash/:hash',transactionController.getTransactionByHash)
router.get('/transaction/address/:address',transactionController.getTransactionByAddress)

router.post('/query',contactquery)
router.get('/accounts',accounts)
router.get('/blocks',blocks)
router.get('/blocks/blocknum/:blocks',blockDetailByBlockNumber)

module.exports=router
