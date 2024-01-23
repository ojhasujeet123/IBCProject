const express=require('express')
const router=express.Router()
const transactionController=require('../controllers/transaction.controller')

router.get('/transaction',transactionController.getTransaction)
// router.get('/transaction',transactionController.getTransactionByHash)


module.exports=router