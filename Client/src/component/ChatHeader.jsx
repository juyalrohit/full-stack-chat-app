import React, { useEffect,useState } from 'react'
import {X} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import Avatar from '../assets/Avatar.png'

const ChatHeader = () => {
  const {selectedUser,setSelectedUser,typingUser,setTypingUser} = useChatStore();
  const {onlineUsers,socket} = useAuthStore();
  
  

  useEffect(()=>{
    socket.on("typingStatus",({userId,isTyping})=>{
         console.log("hii");
         if(isTyping){
            setTypingUser(userId)
         }
         else{
            setTypingUser(null)
         }
    });

    return () => {
      socket.off("typingStatus");
    };

  },[socket]);


  console.log(typingUser);
  console.log("Or ye hai selectec user", selectedUser._id)



  return (
    <div className='p-2.5 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                {/* Avtar */}
                <div className='avatar'>
                    <div className='size-10 rounded-full relative'>
                        <img src={selectedUser.profilePic || Avatar} alt={selectedUser.fullname} />
                    </div>

                </div>

          

            {/* User info */}

            <div>

                <h3 className='font-medium'>
                    {selectedUser.fullname}
                </h3>
                <p className='text-sm text-baes-content/70'>
                    {onlineUsers.includes(selectedUser._id) ? (typingUser === selectedUser._id ? <span className='text-green-400 '>typing...</span> : "Online") : "Offline"}
                </p>

            </div>
              </div>

            <button onClick={()=>setSelectedUser(null)}>
             <X/>
            </button>
        </div>
        
    </div>
  )
}

export default ChatHeader