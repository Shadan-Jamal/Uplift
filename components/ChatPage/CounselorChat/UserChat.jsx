"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import SOCKET_URL from '../../../lib/config.js';

export default function UserChat({ selectedStudent }) {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  console.log(selectedStudent)

  useEffect(() => {
    if (!selectedStudent) return;
    if(!session) return;
    
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/chat/messages?userId=${selectedStudent.studentId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchMessages();
  }, [selectedStudent, session?.user?.email]);
  
  useEffect(() => {
    if (!selectedStudent) return;
    if(!session) return;
    
    const socketUrl = SOCKET_URL.SOCKET_URL;
    
    console.log('Connecting to socket at:', socketUrl);
    const newSocket = io(socketUrl, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);
    
    // Register user with socket
    if (session?.user) {
      newSocket.emit('user_connected', {
        userId: session.user.email,
        userType: 'counselor'
      });
    }
    
    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      console.log("Received message:", message);
      setMessages(prev => {
        const currentMessages = Array.isArray(prev) ? prev : [];
        if (
          (message.studentId === selectedStudent?.studentId && message.facultyId === session?.user?.email) ||
          (message.facultyId === session?.user?.email && message.studentId === selectedStudent?.studentId)
        ) {
          return [...currentMessages, message];
        }
        return currentMessages;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedStudent, session?.user?.email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent || !session) return;

    const messageData = {
      text: newMessage,
      studentId: selectedStudent.studentId,
      senderId: session.user.email,
      facultyId: session.user.email,
      timestamp: new Date().toLocaleString({ hour: 'numeric', minute: 'numeric', hour12: true }),
      senderName: session.user.name || 'Counselor',
      receiverName: selectedStudent.studentName,
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
          receiverId: selectedStudent.studentId,
          receiverType: 'student',
        }),
      });

      if (response.ok) {
        // Emit message through socket
        socket.emit('send_message', messageData);

        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  console.log("Messages in counselor chat", messages)
  if (!selectedStudent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a student to start chatting</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b]"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-black spacing">{selectedStudent.studentId}</h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.senderId === session?.user?.email ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === session?.user?.email
                  ? 'bg-[#eba1c2]/30 text-gray-900'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              {/* <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p> */}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="pl-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
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