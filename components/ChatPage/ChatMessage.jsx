"use client"
import { useSession } from "next-auth/react"
import {AnimatePresence, motion} from "motion/react"
import { useState, useRef, useEffect, useCallback } from "react"
import useLongPress from "./useLongPress"

const ChatMessage = ({
    index, 
    senderId,
    studentId, 
    text, 
    timestamp
}) => {
    const [editButton,showEditButton] = useState({button : false, toggleInput : false})
    const [editedMessage, setEditedMessage] = useState({formInput : text, message: text})
    const { data: session } = useSession();
    const textAreaRef = useRef(null)
    const textAreaDivRef = useRef(null)
    const messageTextRef = useRef(null)
    const [editSize, setEditSize] = useState({ width: null, height: null })

    const submitEditedMessage = async () => {
        if(editedMessage.formInput.trim() === ""){
            setEditedMessage({formInput : text, message : text})
            showEditButton({...editButton, toggleInput: false})
            return
        }

        const response = await fetch("/api/chat/messages",{
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                senderId : senderId,
                studentId: studentId,
                text : text,
                editedMessage: editedMessage.formInput
            })
        })
        if(response.ok){
            setEditedMessage({formInput: editedMessage.formInput, message: editedMessage.formInput})
            showEditButton({...editButton, toggleInput: false})
            return;
        }
        setEditedMessage({formInput : editedMessage.formInput, message : editedMessage.formInput})

    }

    const handleHoverStart = () => {
        if(senderId === session?.user?.email){
            showEditButton({...editButton, button : true})
        }
    }
    
    const handleHoverEnd = () => {
        if(senderId === session?.user?.email){
            showEditButton({...editButton, button : false})
        }
    }
    
    const handleEditButtonClick = () => {
        // Cache current paragraph dimensions before it unmounts
        if(!editButton.toggleInput && messageTextRef.current){
            const p = messageTextRef.current
            setEditSize({ width: p.offsetWidth, height: p.offsetHeight })
        }
        showEditButton({...editButton, toggleInput: !editButton.toggleInput})
    }

    const handleCrossClick = () => {
        setEditedMessage({...editedMessage, formInput : editedMessage.message})
        showEditButton({button: false, toggleInput : false})
    }

    // Long press to reveal edit button on touch devices
    const onLongPress = useCallback(() => {
        if(senderId === session?.user?.email){
            showEditButton(prev => ({ ...prev, button: !editButton.button }))
        }
    }, [senderId, session?.user?.email])

    const longPressHandlers = useLongPress(onLongPress, 550)

    // Ensure textarea matches the cached message size and grows to fit content
    useEffect(() => {
        if(editButton.toggleInput && textAreaRef.current){
            const ta = textAreaRef.current
            // Match cached paragraph width/height if available
            if(editSize.width != null){
                ta.style.width = editSize.width + 'px'
            }
            ta.style.boxSizing = 'border-box'
            ta.style.height = 'auto'
            ta.style.overflow = 'hidden'
            ta.style.resize = 'none'
            if(editSize.height != null){
                ta.style.minHeight = editSize.height + 'px'
            }
            ta.style.height = ta.scrollHeight + 'px'
        }
    }, [editButton.toggleInput, editedMessage.formInput, editSize.width, editSize.height])
    
  return (
    <motion.div 
    onHoverEnd={handleHoverEnd}
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
            onHoverStart={handleHoverStart}
            {...longPressHandlers}
            className={`relative z-50 min-w-[2em] max-w-[17em] md:min-w-[5em] md:max-w-[40em] rounded-lg p-3 flex flex-col h-full gap-1 
            ${senderId === session?.user?.email
                ? 'bg-[#eba1c2]/30 text-gray-900'
                : 'bg-gray-100 text-gray-800'
            }`}
                >
                    
                { (editButton.toggleInput) ? 
                <textarea
                ref={textAreaRef}
                autoFocus
                autoCorrect="off"
                spellCheck={false}
                value={editedMessage.formInput}
                onChange={(e) => setEditedMessage({...editedMessage, formInput : e.target.value})}
                className="min-w-full whitespace-break-spaces text-justify focus:ring-2 focus:ring-[#e9649f] focu ring-1 ring-[#eba1c2] rounded-sm ps-1 outline-0 no-underline text-sm md:text-base"
                />
                : 
                <p ref={messageTextRef} className="w-fit text-justify h-auto text-sm md:text-base">
                    {editedMessage.message}
                </p>
                }
        
            {(editButton.button && !editButton.toggleInput) && 
            <EditButton
            handleEditButtonClick={handleEditButtonClick}
            senderId={senderId} 
            session={session}
            /> 
            }

            {editButton.toggleInput && 
            <div className="flex w-fit justify-start items-center gap-3 mt-2">
                <TickButton
                    submitEditedMessage={submitEditedMessage}
                    senderId={senderId}
                    session={session}
                />
                <CrossButton
                    handleCrossClick={handleCrossClick}
                    senderId={senderId}
                    session={session}
                />
            </div>
            } 
              <p className="w-fit h-fit text-xs mt-1 opacity-70 text-left">
                {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                }) : ''}
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

// Tick (submit) button component
const TickButton = ({ submitEditedMessage, senderId, session }) => (
    <button
        type="button"
        onClick={submitEditedMessage}
        className={`cursor-pointer rounded-full p-1 transition-colors bg-green-200/50 
            ${senderId === session?.user?.email
                ? 'hover:bg-green-300 text-green-800'
                : 'hover:bg-green-300 text-green-800'}
        `}
        aria-label="Submit edit"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            className="text-green-600 hover:text-green-800"
        >
            <path
                d="M5 10.5l4 4 6-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    </button>
);

// Cross (cancel) button component
const CrossButton = ({ handleCrossClick, senderId, session }) => (
    <button
        type="button"
        onClick={handleCrossClick}
        className={`cursor-pointer rounded-full p-1 transition-colors bg-red-200/50 
            ${senderId === session?.user?.email
                ? 'hover:bg-red-300 text-red-800'
                : 'hover:bg-red-300 text-red-800'}
        `}
        aria-label="Cancel edit"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            className="text-red-600 hover:text-red-800"
        >
            <path
                d="M6 6l8 8M6 14L14 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    </button>
);

export default ChatMessage