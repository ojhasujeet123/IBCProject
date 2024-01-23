const express=require('express')
const router=express.Router()
const userController=require('../controllers/auth.controller')
const {registrationValidation,loginValidation,authTokenVerify}=require('../middleware/validateRoute')

//Post
router.post('/signup',[registrationValidation],userController.userRegister)
router.post('/login',[loginValidation],userController.userLogin)
router.post('/account-verify',userController.verifyAccount)
router.post('/verify-otp',userController.resendVerification)
// router.post('/logout',authTokenVerify,userController.userSignout)
router.post('/forgot-password',userController.forgotPassword)
router.post('/reset-password',userController.resetPassword)

//Get
router.get('/user-details',authTokenVerify,userController.userProfile)
router.delete('/delete/:id',userController.userDelete)


module.exports=router
