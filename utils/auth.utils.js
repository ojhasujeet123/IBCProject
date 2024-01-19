const bcrypt = require('bcryptjs')
const User = require('../models/user.model');
const { sendEmail } = require('./Email');

//password Hash Function
async function hashPassword(password) {
    try {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error("password Hashing failed")
    }


}

// Password Compare Function
async function comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
}


//Generate verify Token
function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;

}

//otp generator

function generateOTP() {
    const digits = "0123456789"
    let otp = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length)
        otp += digits.charAt(randomIndex)
    }
    return otp
}



//Handle user verification

async function userVerified(req, res, user) {
    try {
        const tokenTime = user.tokenTime || 0;
        const tokenExpiration = 15 * 60 * 1000;
        // const tokenExpiration = process.env.TOKENEXPIRE;


        if (Date.now() - tokenTime <= tokenExpiration) {
            // Set verified account
            user.isVerified = true
            await user.save();
            // console.log(user);
            res.status(200).json({ message: "User Verified", user });
        } else {
            res.status(400).json({ message: "Verification token has been expired" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Forgot password Handle

async function forgotHandle(res,user,email){
    const otp = generateOTP()
    user.resetOtp = otp;
    user.resetOtpExpiresIn = Date.now() + 10 * 60 * 1000
    await user.save();
    await sendEmail(email, otp, "forgot-password");
    res.status(200).json({ message: "otp sent successfully", user })

}

module.exports = {
    hashPassword,
    comparePassword,
    generateRandomString,
    userVerified,
    generateOTP,
    forgotHandle
};