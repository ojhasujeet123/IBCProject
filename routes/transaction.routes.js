const express=require('express')
const router=express.Router()
const getTransaction=require('../controllers/transaction.controller')

router.get('/transaction',getTransaction)


module.exports=router