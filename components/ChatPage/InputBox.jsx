"use client"
import {motion} from "motion/react"
import { useEffect, useRef } from "react"

const InputBox = ({handleSendMessage, newMessage, setNewMessage, isEditing=false, onCancelEdit, onSubmitEdit}) => {
  const taRef = useRef(null)

  // Autosize with max height
  useEffect(() => {
    if(!taRef.current) return;
    const ta = taRef.current
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px' // cap ~10 lines
  }, [newMessage])

  return (
    <div className="p-4 flex flex-col gap-2">
      {isEditing && (
        <div className="flex items-center justify-between gap-3 bg-[#a8738b]/10 border border-[#a8738b]/30 rounded-md px-3 py-2">
          <p className="text-sm text-gray-800">Editing message</p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancelEdit}
              className="cursor-pointer px-3 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onSubmitEdit}
              disabled={!newMessage || newMessage.trim().length === 0}
              className="cursor-pointer px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </motion.button>
          </div>
        </div>
      )}

      <form onSubmit={isEditing ? (e)=>{e.preventDefault(); onSubmitEdit && onSubmitEdit();} : handleSendMessage} className="flex justify-center items-end max-h-[12em] gap-2">
        <div className="w-full h-full">
          <textarea
            ref={taRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isEditing ? "Edit message..." : "Type a message..."}
            className="flex-1 w-full h-full p-2 rounded-lg border text-gray-900 placeholder:text-gray-500 border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] resize-none max-h-40 overflow-auto"
          />
        </div>
        {!isEditing && (
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!newMessage || newMessage.trim().length === 0}
              className="px-6 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </motion.button>
          </div>
        )}
      </form>
    </div>
  )
}

export default InputBox