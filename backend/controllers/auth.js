import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User from '../models/user.js';
import { generateTokenAndSetCookie } from '../utils/genTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessfulEmail } from '../mailtrap/emails.js';

export const signUp = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if(!email || !name || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const oldUser = await User.findOne({ email });
        if(oldUser){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();;
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await newUser.save();

        generateTokenAndSetCookie(res, newUser._id);

        await sendVerificationEmail(newUser.email, verificationToken);

        return res.status(201).json({ 
            success: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: undefined
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        
        await sendWelcomeEmail(user.email, user.name);

        return res.status(200).json({ 
            success: true, 
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const logOut = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email  || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        generateTokenAndSetCookie(res, user._id);
        
        user.lastLogin = Date.now();

        return res.status(200).json({ 
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });   
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        
        await user.save();

        await sendResetPasswordEmail(email, `${process.env.CLIENT_URI}/reset-password/${resetPasswordToken}`);

        return res.status(200).json({ success: true, message: "Password reset link sent to your email" });        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        })

        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await user.save();

        await sendResetSuccessfulEmail(user.email);

        return res.status(200).json({ status: true, message: "Password Reset Successful" });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message});
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId }).select("-password");
        if(!user)
            return res.status(400).json({ success: false, message: "User not found" });
    
        return res.status(200).json({ success: true, user});
    } catch (error) {
        console.log("Error in check auth: ", error);
        return res.status(500).json({ success: false, message: error.message});
    }
}
