import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";


export const sendOtp = async (req, res) => {

    try {


        const { name, email, password, role = "seeker", adminCode } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (role === "admin") {
            if (!process.env.ADMIN_SECRET) {
                return res.status(500).json({
                    message: "Admin signup is not configured"
                });
            }
            if (adminCode !== process.env.ADMIN_SECRET) {
                return res.status(401).json({
                    message: "Invalid admin code"
                });
            }
        }

        const userExist = await User.findOne({
            email
        })

        if (userExist) {
            return res.status(400).json({
                message: "Email already registered"
            })
        }

        const existingOtp = await Otp.findOne({ email });


        if (existingOtp) {

            const timeDiff = existingOtp.lastSentAt
                ? Date.now() - new Date(existingOtp.lastSentAt).getTime()
                : Infinity;

            if (timeDiff < 60 * 1000) {
                return res.status(429).json({
                    message: "Please wait 60 seconds before requesting another OTP"
                });
            }
        }

        const otp = generateOtp()

        const hashedPassword = await bcrypt.hash(password, 10);

        await Otp.findOneAndUpdate(
            { email },
            {
                name,
                email,
                password: hashedPassword,
                role: role === "admin" ? "admin" : "seeker",
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                lastSentAt: new Date()
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        await sendEmail(email, otp)

        return res.status(200).json({
            message: "OTP sent successfully"
        });

        console.log("otp", otp)


    } catch (error) {

        return res.status(500).json({
            message: error.message
        })
    }


}


export const verifyOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;

        const otpRecord = await Otp.findOne({ email });

        // 1. check record exists
        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP expired or not found"
            });
        }

        // 2. check expiry
        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // 3. check OTP match
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // 4. create user
        const user = await User.create({
            name: otpRecord.name,
            email: otpRecord.email,
            password: otpRecord.password,
            role: otpRecord.role,
            isVerified: true
        });

        // 5. delete OTP record
        await Otp.deleteOne({ email });

        // 6. generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 7. set cookie (AUTO LOGIN)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 8. response
        return res.status(201).json({
            message: "Email verified successfully, user created",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};