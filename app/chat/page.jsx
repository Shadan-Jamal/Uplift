"use client"

import { useState } from "react";
import { motion } from 'motion/react';

export default function ChatPage() {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Handle message submission here
            console.log('Message sent:', message);
            setMessage('');
        }
    };

    return (
        <section className="min-h-screen w-full flex flex-col">
            {/* Chat messages area */}
            <div className="flex-1 p-4">
                {/* Messages will be rendered here */}
            </div>

            {/* Chat input area */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full border-t border-white/20 bg-black/30 backdrop-blur-md"
            >
                <form 
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto p-4 flex gap-4 items-end"
                >
                    <div className="flex-1">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your query here..."
                            className="w-full min-h-[60px] max-h-[180px] p-4 rounded-xl bg-white/10 
                                     border border-white/20 text-white placeholder-white/50
                                     focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50
                                     resize-none"
                            rows={1}
                            style={{ 
                                overflow: 'hidden', 
                                lineHeight: '1.5' 
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
                            }}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white
                                 hover:bg-white/20 transition-colors duration-200
                                 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50"
                    >
                        Send
                    </motion.button>
                </form>
            </motion.div>
        </section>
    );
}