import cloudinary from '../config/cloudinary.js';
import { getReceiverSocketId, io } from '../config/socket.js';
import messageModel from '../models/message.model.js';
import userModel from '../models/user.model.js'



export const getUsersForSidebars = async(req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filterData = await userModel.find({_id:{$ne:loggedInUser}}).select("-password");
        res.status(200).json(filterData);
    } catch (error) {
        console.log('Error in getUsersForSidebars',error);
        res.status(500).json({error:"Internal server error"});
    }
}
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or:[{senderId:userToChatId,receiverId:myId},
                {senderId:myId,receiverId:userToChatId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Erro in getMessages ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId =  getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage);
   
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

