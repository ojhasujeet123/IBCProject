const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const {hashPassword,generateRandomString,comparePassword}=require('../utils/auth.utils')
const UserController = {
    userRegister: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body;

            if (await User.findOne({ email })) {
                return res.status(400).json({ errors: "Sorry! username or email already exists" });
            }

            const securedPassword = await hashPassword(password);

            const user = await User.create({
                username,
                email,
                password: securedPassword,
                verifyToken: generateRandomString(20)
            });

            res.status(200).json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    userLogin: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            const isPasswordValid = await comparePassword(password, user.password);


            if (!user && ! isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            res.status(200).json({ success: true, message: 'User Logged in Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    userDelete: async (req, res) => {
        const userId = req.params.id;

        try {
            const user = req.user;
            await User.deleteOne({ _id: userId });

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
};


module.exports = UserController;
