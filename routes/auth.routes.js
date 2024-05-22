const express=require('express')
const router=express.Router()
const userController=require('../controllers/auth.controller')
const {registrationValidation,loginValidation,accountVerifyValidation,authTokenVerify}=require('../middleware/validateRoute')
const {accountSettings}=require('../controllers/auth.controller')



//Post
router.post('/signup',[registrationValidation],userController.userRegister)
router.post('/login',[loginValidation],userController.userLogin)
router.post('/account-verify',userController.verifyAccount)
router.post('/forgot-password',userController.forgotPassword)
router.post('/reset-password',userController.resetPassword)
router.post('/account-settings',authTokenVerify,accountSettings)



//Get
router.get('/user-details',authTokenVerify,userController.userProfile)
router.delete('/delete/:id',userController.userDelete)

module.exports=router
