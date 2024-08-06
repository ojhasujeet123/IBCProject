const bcrypt = require('bcryptjs')
const User = require('../models/user.model');
const { sendEmail,sendForgotEmail } = require('./Email');
const crypto=require('crypto')



//password Hash Function
async function hashPassword(password) {
    try {
        const saltRounds = 12;
        console.log("inside hash password .............",password);
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
    const characters = "!@$-%&:,~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    console.log(randomString);
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

async function userVerified(res, user) {
    try {
        const tokenTime = user.createdAt|| 0;
        const tokenExpiration = process.env.VERIFICATIONTIMEOUT

        if (Date.now() - tokenTime <= tokenExpiration) {
            // Set verified account
            user.isVerified = true
            user.verifyToken = undefined
            await user.save();
            res.status(200).json({success:true, message: "User Verified", user });
        } else {
            res.status(400).json({ message: "Verification token has been expired" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}








//Forgot password Handle

async function forgotHandle(res, user, email) {
    let newpassword=generateRandomString(8);
    user.password=await hashPassword(newpassword)
    user.save()
    await sendForgotEmail(email,user.username,newpassword);
    res.status(200).json({success:true, message: "A system-generated password has been sent to your email.", user })
}











async function deleteUnverifiedUser(user) {
    const deleteUser = await User.findOne({ _id: user._id, isVerified: false });
    if (deleteUser) {
        await User.deleteOne({ _id: user._id })
        console.log(`user with email ${deleteUser.email} deleted due to non-verified`);
    }
}









const getElapsedTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;

    const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor(diff / (60 * 1000));

    if (years > 0) {
        return `${years} ${years > 1 ? 'years' : 'year'}`;
    } else if (months > 0) {
        return `${months} ${months > 1 ? 'months' : 'month'}`;
    } else if (days > 0) {
        return `${days} ${days > 1 ? 'days' : 'day'}`;
    } else if (hours > 0) {
        return `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    } else {
        return 'Just now';
    }
};


module.exports = {
    hashPassword,
    comparePassword,
    // generateRandomString,
    userVerified,
    generateOTP,
    forgotHandle,
    deleteUnverifiedUser,
    getElapsedTime
};