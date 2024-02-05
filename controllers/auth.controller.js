const User = require('../models/user.model');
const { sendEmail } = require('../utils/Email')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const jwtsecret = process.env.JWTSECRETKEY
const time = process.env.VERIFICATIONTIMEOUT
const { hashPassword,
    comparePassword,
    userVerified,
    forgotHandle,
    generateOTP,
    deleteUnverifiedUser
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
                verifyToken: generateOTP()

            });

            //Email send for account verification
            await sendEmail(email, user.verifyToken, "accountVerification")

            // if account not verified data stored in database for 15 minutes
            setTimeout(async () => {
                await deleteUnverifiedUser(user)
            }, time)

            res.status(200).json({
                success: true,
                user,
                message: "One time password successfully sent on your email"
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },






    //verify account

    verifyAccount: async (req, res, next) => {
        const { email, otp } = req.body
        // const emailToResend=req.query.email || email

        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: "User not exist with this email" })
            }

            if (otp) {
                //verification logic
                if (user.verifyToken === otp && !user.isVerified) {
                    userVerified(res, user)
                } else {
                    res.status(400).json({ message: "Inavlid otp or user already verified" })
                }
            } else {
                const newOtp = generateOTP()
                user.verifyToken = newOtp
                await user.save()
                await sendEmail(email, newOtp, "accountVerification")
                res.status(200).json({ message: "Otp Resend Successfully" })
            }

        } catch (error) {
            console.error(error);
            next(error)
        }
    }
    ,




    //Signin
    userLogin: async (req, res, next) => {

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign({ userId: user._id }, jwtsecret, { expiresIn: '2h' })

            res.status(200).json({
                success: true,
                token,
                user,
                message: 'User Logged in Successfully'
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
            forgotHandle(res, user, email);
        } catch (error) {
            console.error(error);
            next(error)
        }
    },






    //reset password
    // resetPassword: async (req, res, next) => {
    //     try {
    //         const { otp, newpassword, confirmpassword } = req.body

    //         const user = await User.findOne({ email: req.query.email });

    //         if (!user || user.resetOtp !== otp || user.resetOtpExpiresIn < Date.now()) {
    //             return res.status(400).json({ message: "Invalid or expired otp" })
    //         }

    //         if (newpassword !== confirmpassword) {
    //             return res.status(400).json({ message: "Password do not match" })
    //         }
    //         // console.log(newpassword);
    //         const securedPassword = await hashPassword(newpassword)
    //         //update password 
    //         user.password = securedPassword
    //         delete user.resetOtp
    //         delete user.resetOtpExpiresIn

    //         await user.save()
    //         await sendEmail(user.email, " ", "password reset")

    //         res.status(200).json({ message: "Password updated successfully" })
    //     } catch (error) {
    //         console.error(error);
    //         next(error)
    //     }
    // },

    resetPassword: async (req, res, next) => {
        try {
            const {newpassword, confirmpassword } = req.body

            const user = await User.findOne({ email: req.query.email });


            if(!user){
                res.status(404).json({message:"user not found"})
            }
            if (newpassword !== confirmpassword) {
                return res.status(400).json({ message: "Password do not match" })
            }
            // console.log(newpassword);
            const securedPassword = await hashPassword(newpassword)
            //update password 
            user.password = securedPassword
            delete user.resetOtp
            delete user.resetOtpExpiresIn

            await user.save()
            await sendEmail(user.email, " ", "password reset")

            res.status(200).json({ message: "Password updated successfully" })
        } catch (error) {
            console.error(error);
            next(error)
        }
    },

    //Get user profile
    userProfile: async (req, res, next) => {

        try {
            const userId = req.userId
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            const userDetails = {
                username: user.username
            };
            res.status(200).json({ success: true, user: userDetails })
        } catch (error) {
            console.error(error);
            next(error)
        }
    },


    //user delete
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

};

module.exports = UserController;