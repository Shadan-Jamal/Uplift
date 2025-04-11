"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

export default function UserChat({ selectedStudent }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch existing messages when a student is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedStudent || !session) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/messages?userId=${selectedStudent.userId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedStudent, session]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Register user with socket
    if (session?.user) {
      newSocket.emit('user_connected', {
        userId: session.user.userId,
        userType: 'counselor'
      });
    }

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Cleanup on unmount
    return () => newSocket.close();
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent || !session) return;

    const messageData = {
      text: newMessage,
      senderId: session.user.userId,
      receiverId: selectedStudent.userId,
      timestamp: new Date().toLocaleString({ hour: 'numeric', minute: 'numeric', hour12: true }),
      senderName: session.user.name || 'Counselor',
      receiverName: selectedStudent.name || `Student ${selectedStudent.userId}`,
      senderType: 'counselor',
      receiverType: 'student'
    };

    try {
      // Send message to API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage,
          receiverId: selectedStudent.userId,
          receiverType: 'student'
        }),
      });

      if (response.ok) {
        // Emit message through socket
        socket.emit('send_message', messageData);

        // Add message to local state
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="w-3/4 h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <p className="text-gray-500 text-lg">Select a student to start chatting</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-3/4 h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b]"></div>
      </div>
    );
  }

  return (
    <div className="w-3/4 h-full flex flex-col bg-white/90 backdrop-blur-3xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#a8738b]/20 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#a8738b] flex items-center justify-center text-white font-semibold text-lg">
          {selectedStudent.name?.[0] || selectedStudent.userId[0]}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {selectedStudent.name || `Student ${selectedStudent.userId}`}
          </h3>
          <p className="text-sm text-gray-500">{selectedStudent.email}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.senderId === session?.user?.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === session?.user?.userId
                  ? 'bg-[#eba1c2]/30 text-gray-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm text-gray-900">{message.text}</p>
              <p className="text-xs mt-1 text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#a8738b]/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border text-gray-900 placeholder:text-gray-500 border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b]"
          />
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
    </div>
  );
} 