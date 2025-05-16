"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import SOCKET_URL from '../../../lib/config.js';

export default function UserChat({ selectedStudent, isSideBarOpen }) {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [isStudentOnline, setIsStudentOnline] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);

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
    
    // Listen for student status changes
    newSocket.on('student_status_change', (onlineStudentIds) => {
      console.log('Received student status change in chat:', onlineStudentIds);
      console.log(selectedStudent.studentId, onlineStudentIds)
      setIsStudentOnline(onlineStudentIds.includes(selectedStudent.studentId));
    });
    
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

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || !selectedStudent) return;

    try {
      setReporting(true);
      setReportStatus('sending');
      
      const response = await fetch('/api/chat/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.studentId,
          reason: reportReason
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setReportStatus('success');
        // Show success message for 3 seconds
        setTimeout(() => {
          setShowReportModal(false);
          setReportReason('');
          setReportStatus(null);
        }, 3000);
      } else {
        setReportStatus('error');
        console.error('Failed to send report:', data.error);
      }
    } catch (error) {
      setReportStatus('error');
      console.error('Error sending report:', error);
    } finally {
      setReporting(false);
    }
  };

  console.log("Messages in counselor chat", messages)
  if (!selectedStudent) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${isSideBarOpen ? 'blur-xs bg-white/90' : 'bg-white/90'} backdrop-blur-3xl`}>
        <p className="text-gray-500">Select a student to start chatting</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${isSideBarOpen ? 'blur-xs bg-white/90' : 'bg-white/90'} backdrop-blur-3xl`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b]"></div>
      </div>
    );
  }
  return (
    <div className={`flex flex-col h-full w-full ${isSideBarOpen ? 'blur-xs bg-white/90' : 'bg-white/90'} backdrop-blur-3xl`}>
      {/* Chat header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#a8738b] flex items-center justify-center text-white font-semibold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {isStudentOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black spacing">{selectedStudent.studentId}</h2>
              <p className="text-sm text-gray-500">{isStudentOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Report
          </motion.button>
        </div>
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
              <p className="text-xs mt-1 opacity-70 text-right">
                {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4">
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

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Student</h3>
              {reportStatus === 'success' ? (
                <div className="text-center py-4">
                  <div className="text-green-500 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Report has been sent to your email</p>
                </div>
              ) : (
                <form onSubmit={handleReport}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Report
                    </label>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8738b] focus:border-transparent placeholder:text-gray-600/60 text-black"
                      rows="4"
                      placeholder="Please provide details about why you are reporting this student..."
                      required
                      disabled={reporting}
                    />
                  </div>
                  {reportStatus === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      Failed to send report. Please try again.
                    </div>
                  )}
                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setShowReportModal(false);
                        setReportReason('');
                        setReportStatus(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={reporting}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={reporting}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {reporting ? 'Sending...' : 'Send Report'}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 