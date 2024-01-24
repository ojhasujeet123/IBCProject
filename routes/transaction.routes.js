const express=require('express')
const router=express.Router()
const transactionController=require('../controllers/transaction.controller')

router.get('/transaction',transactionController.getTransaction)
router.get('/transaction-chart',transactionController.getTransactionForChart)


module.exports=router