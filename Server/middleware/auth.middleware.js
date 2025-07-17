import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async(req , res,next)=>{
    try {
        const token = req.cookies.jwt;
        
        if(!token){
            return res.status(400).json({message:"Unauthorized - No Token Provided"});
        }

        const decode = await jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(400).json({message:"Unauthorized - Invalid Token"});
        }

        const user = await User.findById(decode.userId).select("-password");
        
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log("fail",error.message);
        res.status(500).send({message:"Internal Server Error"});
    }
}