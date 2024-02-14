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
            return res.status(400).json({ message: 'User not found' });
          }
      
          const isPasswordValid = await comparePassword(password, user.password);
      
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
          }
      
          // Initialize tokenTimes if not present
          if (!user.tokenTimes) {
            user.tokenTimes = [];
          }
      
          // Update tokenTimes and limit to the latest 5 entries
          user.tokenTimes.unshift(Date.now());
          user.tokenTimes = user.tokenTimes.slice(0, 5);
      
          await user.save();
      
          const token = jwt.sign({ userId: user._id }, jwtsecret);
      
          res.status(200).json({
            success: true,
            token,
            user,
            message: 'User Logged in Successfully',
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
            //Handle forgot With reset
            forgotHandle(res, user, email);
        } catch (error) {
            console.error(error);
            next(error)
        }
    },

 







    //reset password
    resetPassword: async (req, res, next) => {
        try {
            const { newpassword, confirmpassword } = req.body

            const user = await User.findOne({ email: req.query.email });


            if (!user) {
                res.status(404).json({ message: "user not found" })
            }
            if (newpassword !== confirmpassword) {
                return res.status(400).json({ message: "Password do not match" })
            }
            // console.log(newpassword);
            const securedPassword = await hashPassword(newpassword)
            //update password 
            user.password = securedPassword

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
            const userId = req.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            // Convert login times to array format
            const loginTimes = user.tokenTimes.map(time => time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
            const userDetails = {
                username: user.username,
                email: user.email,
                lastLogin: loginTimes
            };
            res.status(200).json({ success: true, user: userDetails });
        } catch (error) {
            console.error(error);
            next(error);
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













//ACCOUNT SETTINGS 

// const accountSettings = async (req, res, next) => {
//     try {
//         const userId = req.userId;
//         let user = await User.findById(userId);
//         const { email } = req.body;
//         const { oldpassword, newpassword, confirmpassword } = req.body;

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (email) {
//             user.email = email;
//         }

//         if (oldpassword && newpassword && confirmpassword) {
//             let correctPassword = comparePassword(oldpassword, user.password);
//             if (!correctPassword) {
//                 return res.status(400).json({ message: "Old password wrong" });
//             }

//             if (newpassword !== confirmpassword) {
//                 return res.status(400).json({ message: "Password do not match" });
//             }

//             const updatePassword = await hashPassword(newpassword);
//             user.password = updatePassword;
//         }

//         await user.save();

//         // Send the response only once at the end of the function
//         return res.status(200).json({ success: true, user });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };


const accountSettings = async (req, res, next) => {
    try {
        const userId = req.userId;
        let user = await User.findById(userId);
        const { email, oldpassword, newpassword, confirmpassword } = req.body;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(email && oldpassword){
            const correctPassword = await comparePassword(oldpassword, user.password);
            if (!correctPassword) {
                return res.status(400).json({ message: "Old password wrong" });
            }else{
                user.email=email
            }
        }

        if (oldpassword && newpassword && confirmpassword) {
            console.log(user.password);
            const correctPassword = await comparePassword(oldpassword, user.password);
            console.log(correctPassword);
            if (!correctPassword) {
                return res.status(400).json({ message: "Old password wrong" });
            }

            if (newpassword !== confirmpassword) {
                return res.status(400).json({ message: "Password do not match" });
            }

            const updatePassword = await hashPassword(newpassword);
            user.password = updatePassword;
        }

        // Save the user only if there are changes
        if (user.isModified()) {
            await user.save();
        }

        // Send the response only once at the end of the function
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = { ...UserController, accountSettings };