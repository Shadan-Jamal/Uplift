"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import SOCKET_URL from "../../../lib/config.js"

export default function UserChat({ selectedFaculty }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  console.log(session?.user)
  // Fetch existing messages when a faculty is selected
  useEffect(() => {
    if (!selectedFaculty) return;
    if(!session) return;

    // Clear messages when faculty changes
    setMessages([]);

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/messages?email=${selectedFaculty.email}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched messages:', data);
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Initialize socket connection with dynamic URL
    // const socketUrl = "http://localhost:3001";
    const socketUrl = SOCKET_URL.SOCKET_URL;

    console.log("Socket URL", SOCKET_URL)
    console.log('Connecting to socket at:', SOCKET_URL);
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
        userId: session.user.id,
        userType: 'student'
      });
    }

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      console.log("Received message:", message);
      // Only add message if it's for the current conversation
      if (
        (message.studentId === session?.user?.id && message.facultyId === selectedFaculty?.email) ||
        (message.facultyId === selectedFaculty?.email && message.studentId === session?.user?.id)
      ) {
        setMessages(prev => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          return [...currentMessages, message];
        });
      }
    });
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [selectedFaculty, session?.user?.id]); // Remove messages from dependencies

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFaculty || !session) return;

    const messageData = {
      text: newMessage,
      studentId: session.user.id,
      senderId: session.user.id,
      facultyId: selectedFaculty.email,
      timestamp: new Date().toLocaleString({ hour: 'numeric', minute: 'numeric', hour12: true }),
      senderName: session.user.name || 'Student',
      receiverName: selectedFaculty.name,
      senderType: 'student',
      receiverType: 'counselor'
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
          receiverId: selectedFaculty.email,
          receiverType: 'counselor'
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
  console.log("Messages in student chat", messages)
  if (!selectedFaculty) {
    return (
      <div className="w-3/4 h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <p className="text-gray-500 text-lg">Select a faculty member to start chatting</p>
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
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={selectedFaculty.image}
            alt={selectedFaculty.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{selectedFaculty.name}</h3>
          <p className="text-sm text-gray-500">{selectedFaculty.email}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 && messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === session?.user?.id
                  ? 'bg-[#eba1c2]/30 text-gray-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm text-gray-900">{message.text}</p>
              {/* <p className="text-xs mt-1 text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p> */}
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
