"use client"
import { useSession } from "next-auth/react"
import {AnimatePresence, motion} from "motion/react"
import { useState } from "react"

const ChatMessage = ({
    index, 
    senderId, 
    text, 
    timestamp
}) => {
    const [editButton,showEditButton] = useState(false)
    const [editedMessage, setEditedMessage] = useState({formInput : text, message: text})
    const { data: session } = useSession();

    const handleClick = async () => {
        if(editedMessage.formInput.trim() !== ""){
            setEditedMessage({formInput : "", message : text})
            return
        }
        const response = await fetch("/api/chat/messages",{
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                senderId : senderId,
                text : text,
                editedMessage: editedMessage.formInput
            })
        })
        if(response.ok){
            setEditedMessage({...editedMessage, message: editedMessage.formInput})
            return;
        }
        setEditedMessage({formInput : "", message : text})

    }

  return (
    <motion.div 
    onHoverEnd={() => showEditButton(false)}
    key={index}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              senderId === session?.user?.email ? 'justify-end' : 'justify-start'
            }`}
          >
            <motion.div
            onHoverStart={() => showEditButton(true)}
              className={`relative z-50 max-w-[70%] rounded-lg p-3 ${
                senderId === session?.user?.email
                  ? 'bg-[#eba1c2]/30 text-gray-900'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
                {/* { editButton ? 
                <div>
                    <input 
                    type="text" 
                    value={editedMessage.formInput} 
                    onChange={(e) => setEditedMessage({...editedMessage, formInput: e.target.value})}
                    />
                </div> : 
                } */}
                <p className="text-balance h-auto text-left">{editedMessage.message}</p>
              <p className="text-xs mt-1 opacity-70 text-left">
                {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                }) : ''}
              </p>
            {/* {editButton && <EditButton
            onClick={handleClick}
            senderId={senderId} 
            session={session}
            />} */}
            </motion.div>
          </motion.div>
    </motion.div>
  )
}

const EditButton = ({ onClick, senderId, session }) => (
    <AnimatePresence>
        <motion.div
        initial={{y: -5, transition : {delay: 0.2}}}
        animate={{y: 0, transition : {ease : "easeIn", duration : 0.1}}}
        exit={{y: -5}}
        className={`absolute -z-10 ${senderId === session?.user?.email ? "-left-10" : "-right-10"} top-1/2 -translate-y-1/2 flex items-center justify-center`}
        >
            <button
                type="button"
                // onClick={onClick}
                className={`cursor-pointer rounded-full p-1 transition-colors bg-gray-200/50 
                    ${senderId === session?.user?.email
                  ? 'hover:bg-[#eba1c2]/30 text-gray-900'
                  : 'hover:bg-gray-300 text-gray-800'}
                    `}
                aria-label="Edit message"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    className="text-gray-500 hover:text-gray-700"
                >
                    <path
                        d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    <path
                        d="M14.5 6.5l-1-1a1.414 1.414 0 00-2 0l-1 1 2.5 2.5 1-1a1.414 1.414 0 000-2z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </svg>
            </button>
        </motion.div>
    </AnimatePresence>
);

export default ChatMessage