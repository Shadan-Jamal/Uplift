"use client";

import { useState, useEffect,useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { io } from 'socket.io-client';

export default function ChatCard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      if (selectedStudent && 
          (message.senderId === selectedStudent.email || 
           message.receiverId === selectedStudent.email)) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Fetch students who have sent messages
    fetchStudents();

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchMessages();
    }
  }, [selectedStudent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/chat/students');
      const data = await response.json();
      if (data.students) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat?receiverId=${selectedStudent.email}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent) return;

    const messageData = {
      text: newMessage,
      senderId: 'counselor', // Replace with actual counselor ID
      receiverId: selectedStudent.email,
      timestamp: new Date(),
    };

    try {
      // Save message to database
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (data.message) {
        // Emit message through socket
        socket.emit('send_message', data.message);
        // Update local state
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#a8738b]"
    >
      <h3 className="text-2xl font-bold text-black mb-4">Chat with Students</h3>
      
      <div className="flex h-[500px]">
        {/* Students List */}
        <div className="w-1/3 border-r border-[#a8738b]/20 pr-4">
          <div className="space-y-2">
            {students.map((student) => (
              <motion.div
                key={student.email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStudent(student)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedStudent?.email === student.email
                    ? 'bg-[#eba1c2]/30'
                    : 'hover:bg-[#eba1c2]/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={student.image || '/default-avatar.png'}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-black">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 pl-4 flex flex-col">
          {selectedStudent ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.senderId === 'counselor' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'counselor'
                          ? 'bg-[#eba1c2]/30 text-black'
                          : 'bg-gray-100 text-black'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors duration-200"
                >
                  Send
                </motion.button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a student to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 