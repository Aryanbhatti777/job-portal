import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (userID) => {
    return jwt.sign(
        { id: userID },
        process.env.JWT_SECRET, {
        expiresIn: "7d"
    }
    );
};

export const Register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "seeker"
        })

        const token = createToken(newUser._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        })


    } catch (error) {
        return res.status(500).json({
        message: error.message,
      })
    }
}

export const Login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Both fields are required"
            })
        }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).json({
            message: "Unauthorized"
        })
    }

    let isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(400).json({
            message: "wrong email or password"
        })
    }

    let token = createToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000

    })

    return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })

    } catch (error) {
        return res.status(500).json({
        message: error.message,
      })
    }

}

export const logout = async (req, res) => {
    try {

        res.clearCookie("token");

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
