const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/Email')
const jwt = require('jsonwebtoken')
require('dotenv').config();
// const jwtsecret = process.env.JWTSECRETKEY
const { hashPassword,
        generateRandomString,
        comparePassword,
        userVerified,
        forgotHandle, 
        generateOTP
    } = require('../utils/auth.utils')






const UserController = {

    //Signup
    userRegister: async (req, res, next) => {
        try {
            const { username, email, password, confirmPassword } = req.body;

            if (await User.findOne({ email })) {
                return res.status(400).json({ errors: "Sorry!  email already exists" });
            }

            const securedPassword = await hashPassword(password);


            //user create

            const user = await User.create({
                username,
                email,
                password: securedPassword,
                // verifyToken: generateRandomString(6)
                verifyToken: generateOTP()

            });

            //Email send for account verification

            await sendEmail(email, user.verifyToken, "accountVerification")

            res.status(200).json({ success: true, user });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },


    //Signin
    userLogin: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }

            const isPasswordValid = await comparePassword(password, user.password);


            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWTSECRETKEY, { expiresIn: '2h' })


            res.status(200).json({  success: true,
                                    token,
                                    message: 'User Logged in Successfully' 
                                });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },




    //Verification by token
    verifyAccount: async (req, res, next) => {
        const {email,otp}=req.body
        try {
            const user = await User.findOne({ email });

            // const user = await User.findOne({ email: req.query.email });
            // const verifyToken = req.query.verifytoken;
            if(!user){
                return res.status(400).json({message:"User not found"})
            }

            if (user.verifyToken === otp && !user.isVerified) {

                //verification function call
                userVerified(req, res, user);

            } else {
                res.status(400).json({ message: "Invalid account or user already verified" });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    },



    userDelete: async (req, res, next) => {
        const userId = req.params.id;
        try {
            const user = req.user;
            await User.deleteOne({ _id: userId });

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },

    //signout

    userSignout: async (req, res, next) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({ success: false, message: "No token provided" });
            }

            // Verify the token
            jwt.verify(token, process.env.JWTSECRETKEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: "Invalid token" });
                }


                res.status(200).json({ success: true, message: "User signed out" });
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    //forgot password

    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            //Handle forgot otp
            forgotHandle(res,user,email);      
        } catch (error) {
            console.error(error);
            next(error)
        }
    },


    //reset password
    resetPassword: async (req, res, next) => {
        try {
            const { otp, newpassword, confirmpassword } = req.body

            const user = await User.findOne({ email: req.query.email });
            if (!user || user.resetOtp !== otp || user.resetOtpExpiresIn < Date.now()) {
                return res.status(400).json({ message: "Invalid or expired otp" })
            }
            if (newpassword !== confirmpassword) {
                return res.status(400).json({ message: "Password do not match" })
            }
            console.log(newpassword);
            const securedPassword = await hashPassword(newpassword)
            //update password 
            user.password = securedPassword
            delete user.resetOtp 
             delete user.resetOtpExpiresIn 

            await user.save()
            res.status(200).json({ message: "Password updated successfully" })
        } catch (error) {
            console.error(error);
            next(error)
        }
    }

};

module.exports = UserController;
