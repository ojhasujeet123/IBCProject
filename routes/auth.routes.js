const express=require('express')
const router=express.Router()
const userController=require('../controllers/auth.controller')
const {registrationValidation,loginValidation}=require('../middleware/validateRoute')

router.post('/signup',[registrationValidation],userController.userRegister)
router.post('/login',[loginValidation],userController.userLogin)
router.post('/account-verify',userController.verifyAccount)
router.post('/logout',userController.userSignout)
router.post('/forgot-password',userController.forgotPassword)
router.post('/reset-password',userController.resetPassword)
router.delete('/delete/:id',userController.userDelete)


module.exports=router