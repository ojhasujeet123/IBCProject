const express=require('express')
const router=express.Router()
const userController=require('../controllers/auth.controller')
const {registrationValidation,loginValidation}=require('../middleware/validateRoute')

router.post('/signup',[registrationValidation],userController.userRegister)
router.post('/login',[loginValidation],userController.userLogin)
router.post('/delete/:id',userController.userDelete)
router.post('/account-verify',userController.accountVerify)

module.exports=router