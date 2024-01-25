const express=require('express')
const router=express.Router()
const transactionController=require('../controllers/transaction.controller')
const {tokenTransaction}=require('../controllers/transaction.controller')

router.get('/tokentxns',tokenTransaction)


router.get('/transaction',transactionController.getAllTransactions)
router.get('/transaction/chart',transactionController.getTransactionForChart)
router.get('/transaction/hash/:hash',transactionController.getTransactionByHash)
router.get('/transaction/address/:adress',transactionController.getTransactionByAddress)


module.exports=router