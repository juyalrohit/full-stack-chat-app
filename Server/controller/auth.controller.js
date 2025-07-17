import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generatetoken.js';
import cloudinary from '../config/cloudinary.js'

export const signup = async(req,res)=>{
    const {fullname,email,password} = req.body;

    try {
        
        if(!fullname || !email || !password){
            res.status(400).send("All fields are required!");
        }

        if(password.length<6){
        return res.status(400).json({message:"Password must be at leas 6 characters"});
    }

    const user = await userModel.findOne({email});
    

    if(user){
        return res.status(400).json({message:"Email Already Exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

   

    const newUser = new userModel({
        password:hashPassword,
        fullname,
        email
    });

    if(newUser){
       generateToken(newUser._id,res);
       await newUser.save();

      res.status(201).json({
        _id : newUser._id,
        fullname : newUser.fullname,
        email : newUser.email,
        profilePic : newUser.profilePic
      })
    }
    else{
        res.status(400).json({message:"Invalid user data"});
    }
        
        
    } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const login = async(req,res)=>{
   const {email,password} = req.body;

   try {
     
       if(!email || !password){
         res.status(400).json({message:"All fields are required"});
       }

        const user = await userModel.findOne({email});

        if(!user){
            res.status(400).send({message:"Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id,res);
         res.status(200).json({
            _id: user._id,
            fullName: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
    });
    }
    
    catch (error) {
      console.log("Login process fail",error.message);
      res.status(500).json({message:"Internal Server Error"});
   }
}

export const logout = async(req,res)=>{
    try {
        res.cookie('jwt',"",{maxAge:0});
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        console.log("Error in loggout controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
  

        if(!profilePic){
            return res.status(400).json({message:"Profile Picture is required"});
        }

      const uploadProfileResponse =   await cloudinary.uploader.upload(profilePic);
      console.log(uploadProfileResponse)
      const updatedUser = await userModel.findByIdAndUpdate(userId,{profilePic:uploadProfileResponse.secure_url},{new:true});

       res.status(200).json(updatedUser)


  
    } catch (error) {
        console.log("error in update profile:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const checkAuth = async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth Controller",error.message);
        res.status(500).json({message:"Internal Server Error"}); 
    }
}