import User from "../models/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (userID) => {
    return jwt.sign(
        {id: userID},
        process.env.JWT_SECRET,{
            expiresIn : "7d"
        }
    );
};

export const signUp = async (req,res) => {

    try {

        const { name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const userExist = await User.findOne( { email });
        if(userExist){
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash( password ,10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "seeker"
        })

        const token = createToken(newUser._id)

        res.cookie("token",token,{
            httpOnly : true,
            secure: false,
            sameSite : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            id: newUser._id,
            name : newUser.name,
            email: newUser.email,
            role: newUser.role
        })


    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}