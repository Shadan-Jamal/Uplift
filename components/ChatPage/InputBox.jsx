"use client"
import {motion} from "motion/react"

const InputBox = ({handleSendMessage, newMessage, setNewMessage}) => {
  return (
    <form onSubmit={handleSendMessage} className="p-4 flex justify-center items-center max-h-[10em]">
        <div className="w-full h-full space-x-2">
          <textarea
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 w-full h-full p-2 rounded-lg border text-gray-900 placeholder:text-gray-500 border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] resize-none"
          />
        </div>
        <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors duration-200"
            >
              Send
            </motion.button>
        </div>
      </form>
  )
}

export default InputBox