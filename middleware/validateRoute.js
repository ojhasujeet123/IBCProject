const {validationResult,check}=require('express-validator')
const jwt=require('jsonwebtoken')

//Show validation Error
const handleValidationErrors=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    next()
}

// Rigtration validation middleware
const registrationValidation=[
    check('email').isEmail().withMessage('Invalid email address'),
    check('username').isLength({min:3, max:24}).isAlphanumeric(),
    check('password').isLength({min:6,max:24}),
    check('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Password do not match')
        }
        return true;
    }),
    handleValidationErrors,

];


//Login Validation Middleware
const loginValidation=[
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({min:6,max:24}),

    handleValidationErrors
]

const accountVerifyValidation=[
    check('email').isEmail().withMessage('Invalid email address'),
    check('otp').isLength({min:6,max:24}),

    handleValidationErrors

]
//Handle Internal server Error
const errorHandler=(err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({success:false, message:"Internal server error"})
}




//Handle Authentication token

const authTokenVerify=(req,res,next)=>{

    const token=req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"No token provided"})
    }

    jwt.verify(token,process.env.JWTSECRETKEY,(err,decoded)=>{
        if(err){
            return res.status(401).json({success:false,message:"invalid token"})
        }
        req.userId=decoded.userId;
        next();
    })
}

module.exports={registrationValidation,
                loginValidation,
                accountVerifyValidation,
                errorHandler,
                authTokenVerify}