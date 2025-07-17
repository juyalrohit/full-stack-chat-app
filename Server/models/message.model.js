import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,  // ✅ fixed here
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,  // ✅ fixed here
        ref: 'User',
        required: true
    },
    text: {
        type: String  // ✅ fixed here
    },
    image: {
        type: String  // ✅ fixed here
    }
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
