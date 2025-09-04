"use client"
import { useSession } from "next-auth/react"
import {AnimatePresence, motion} from "motion/react"
import { useRef } from "react"
import useLongPress from "./useLongPress"

const ChatMessage = ({
    index, 
    senderId,
    studentId, 
    text, 
    timestamp,
    edited,
    showEdit,
    onHoverShow,
    onHoverHide,
    onEditClick,
    onLongPress
}) => {
    const { data: session } = useSession();
    const textAreaDivRef = useRef(null)

  return (
    <motion.div 
    onHoverEnd={() => { if(senderId === session?.user?.email){ onHoverHide && onHoverHide() } }}
    key={index}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex h-auto ${
              senderId === session?.user?.email ? 'justify-end' : 'justify-start'
            }`}
          >
            <motion.div
            ref={textAreaDivRef}
            onHoverStart={() => { if(senderId === session?.user?.email){ onHoverShow && onHoverShow() } }}
            {...useLongPress(() => { if(senderId === session?.user?.email){ onLongPress && onLongPress() } }, 550)}
            className={`relative z-50 min-w-[2em] max-w-[17em] md:min-w-[5em] md:max-w-[40em] rounded-lg p-3 flex flex-col h-full gap-1 
            ${senderId === session?.user?.email
                ? 'bg-[#eba1c2]/30 text-gray-900'
                : 'bg-gray-100 text-gray-800'
            }`}
                >
                <p className="w-fit text-justify h-auto text-sm md:text-base select-none">
                    {text}
                </p>
        
            {(showEdit) && 
            <EditButton
            handleEditButtonClick={onEditClick}
            senderId={senderId} 
            session={session}
            /> 
            }
              <p className="w-fit h-fit text-[10px] md:text-xs mt-1 opacity-70 text-left">
                {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                }) : ''}
                {edited && (
                  <span className=" ms-2 text-[10px] md:text-[11px] text-gray-500 select-none">Edited</span>
                )}
              </p>
            </motion.div>
          </motion.div>
    </motion.div>
  )
}

const EditButton = ({ 
    senderId, 
    session, 
    handleEditButtonClick
}) => (
    <AnimatePresence>
        <motion.div
            initial={{y: -5, transition : {delay: 0.2}}}
            animate={{y: 0, transition : {ease : "easeIn", duration : 0.1}}}
            exit={{y: -5}}
            className={`absolute -z-10 ${senderId === session?.user?.email ? "-left-10" : "-right-10"} top-1/2 -translate-y-1/2 flex items-center justify-center gap-2`}
        >
            {/* Edit (pencil) button */}
            <button
                type="button"
                onClick={handleEditButtonClick}
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