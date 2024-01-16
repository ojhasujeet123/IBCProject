const {validationResult,check}=require('express-validator')

const handleValidationErrors=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    next()
}


const registrationValidation=[
    check('email').isEmail().withMessage('Invalid email address'),
    check('username').isLength({min:3, max:30}).isAlphanumeric(),
    check('password').isLength({min:6,max:24}),
    check('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Password do not match')
        }
        return true;
    }),
    handleValidationErrors,

];


const loginValidation=[
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({min:6,max:24}),

    handleValidationErrors
]

module.exports={registrationValidation,loginValidation}