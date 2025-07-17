import React from 'react'
import {X} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import Avatar  from '../assets/avatar.png'
const ChatHeader = () => {
  const {selectedUser,setSelectedUser} = useChatStore();
  const {onlineUsers} = useAuthStore();


  return (
    <div className='p-2.5 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                {/* Avtar */}
                <div className='avatar'>
                    <div className='size-10 rounded-full relative'>
                        <img src={selectedUser.profilePic || 'avatar.png' } alt={selectedUser.fullname} />
                    </div>

                </div>

          

            {/* User info */}

            <div>

                <h3 className='font-medium'>
                    {selectedUser.fullname}
                </h3>
                <p className='text-sm text-baes-content/70'>
                    {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
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