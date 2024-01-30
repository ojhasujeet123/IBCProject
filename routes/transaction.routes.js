const express=require('express')
const router=express.Router()
const transactionController=require('../controllers/transaction.controller')
const {tokenTransaction,getTransactionForChart, contactquery, accounts}=require('../controllers/main.controller')

router.get('/tokentxns',tokenTransaction)

router.get('/transaction',transactionController.getAllTransactions)
router.get('/transaction/chart',getTransactionForChart)
router.get('/transaction/hash/:hash',transactionController.getTransactionByHash)
router.get('/transaction/address/:address',transactionController.getTransactionByAddress)

router.post('/query',contactquery)
router.get('/accounts',accounts)
module.exports=router
