import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const checkIsLoggedIn = async (req,res,next) => {

    try {
        const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    )

    const person = await User.findById(decoded.id)
    req.user = person

    next();

    } catch (error) {
        return res.status(400).json({
            message: "Server error"
        })
    }
}