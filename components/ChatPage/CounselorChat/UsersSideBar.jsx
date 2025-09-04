"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import SOCKET_URL from '../../../lib/config.js';


export default function UsersSideBar({ onSelectStudent, selectedStudent, isSideBarOpen, setIsSideBarOpen }) {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineStudents, setOnlineStudents] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});

  // Function to mark messages as read
  const markMessagesAsRead = async (studentId) => {
    if (!session?.user?.email || !studentId) return;
    
    try {
      const response = await fetch('/api/chat/messages/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          facultyId: session.user.email
        }),
      });

      if (response.ok) {
        // Update unread counts locally
        setUnreadCounts(prev => ({
          ...prev,
          [studentId]: 0
        }));
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Handle student selection
  const handleStudentSelect = async (student) => {
    onSelectStudent(student);
    setIsSideBarOpen(false);
    // Mark messages as read when selecting a student
    await markMessagesAsRead(student.studentId);
  };

  useEffect(() => {
    if (!session) return;
    // Initialize socket connection
    const socketUrl = SOCKET_URL.SOCKET_URL;

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
    });
    // console.log('Connecting to socket at:', socketUrl);
    setSocket(newSocket);

    // Register user with socket
    newSocket.emit('user_connected', {
      userId: session.user.email,
      userType: 'counselor'
    });
    // console.log("inside useEffect to check event ")
    // Listen for student status changes
    newSocket.on('student_status_change', (onlineStudentIds) => {
      // console.log('Received student status change:', onlineStudentIds);
      setOnlineStudents(new Set(onlineStudentIds));
    });

    // Listen for new student messages
    newSocket.on('new_student_message', async (data) => {
      // console.log('Received new_student_message event:', data);
      if (data.facultyId === session.user.email) {
        try {
          setLoading(true);
          const response = await fetch(`/api/chat/students?email=${session.user.email}`);
          if (response.ok) {
            const updatedStudents = await response.json();
            // console.log('Updated students list:', updatedStudents);
            setStudents(updatedStudents);
            
            // Update unread count for the student who sent the message
            if (data.studentId !== selectedStudent?.studentId) {
              setUnreadCounts(prev => ({
                ...prev,
                [data.studentId]: (prev[data.studentId] || 0) + 1
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching updated students:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [session, selectedStudent]);

  useEffect(() => {
    if (!session) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/students?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          // Sort students by latest message timestamp
          const sortedStudents = data.sort((a, b) => {
            return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
          });
          setStudents(sortedStudents);

          // Initialize unread counts from the API response
          const counts = {};
          data.forEach(student => {
            counts[student.studentId] = student.unreadCount || 0;
          });
          setUnreadCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();

    // Set up polling to refresh conversations
    const interval = setInterval(fetchStudents, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [session]);

  // Listen for new messages to update unread counts
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message) => {
      if (message.facultyId === session?.user?.email) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.studentId]: (prev[message.studentId] || 0) + 1
        }));
        
        // Move the student to the top of the list
        setStudents(prev => {
          const updatedStudents = [...prev];
          const studentIndex = updatedStudents.findIndex(s => s.studentId === message.studentId);
          if (studentIndex !== -1) {
            const student = updatedStudents[studentIndex];
            updatedStudents.splice(studentIndex, 1);
            updatedStudents.unshift({
              ...student,
              lastMessageTime: new Date().toISOString()
            });
          }
          return updatedStudents;
        });
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket, session]);

  // console.log("onlineStudents", onlineStudents)
  if (loading) {
    return (
      <div className="w-1/4 h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b]"></div>
      </div>
    );
  }

  const renderStudentList = (students) => (
    <div className="divide-y divide-[#a8738b]/20">
      {students.map((student) => (
        <motion.div
          key={student.studentId}
          whileHover={{ backgroundColor: 'rgba(168, 115, 139, 0.1)' }}
          className={`p-4 cursor-pointer ${
            selectedStudent?.studentId === student.studentId
              ? 'bg-[#a8738b]/20'
              : ''
          } flex items-center justify-between gap-4`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => handleStudentSelect(student)}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#a8738b] flex items-center justify-center text-white font-semibold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {onlineStudents.has(student.studentId) && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-md font-medium text-gray-900 truncate">
                {student.studentId}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {student.lastMessage || 'No messages yet'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500">
              {student.lastMessageTime ? new Date(student.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
            {unreadCounts[student.studentId] > 0 && (
              <span className="bg-[#a8738b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCounts[student.studentId]}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Desktop view
  if(typeof window !== 'undefined' && window.innerWidth > 800) {
    return (
      <div className="w-1/4 h-full flex flex-col bg-white/90 backdrop-blur-3xl">
        <div className="p-4 border-b border-[#a8738b]/20">
          <h2 className="text-lg font-semibold text-gray-900">Students</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {students.message ? (
            <div className="p-4 text-center text-gray-500">
              No students have sent messages yet
            </div>
          ) : (
            renderStudentList(students)
          )}
        </div>
      </div>
    );
  }

  // Mobile view
  return (
    <AnimatePresence>
      {(
        <motion.div 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          exit={{ x: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 z-50 min-w-72 h-full ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out`}
        >
          {/* Sidebar */}
          <div className="absolute left-0 top-0 bottom-0 w-full bg-white shadow-xl pt-16">
            <div className="h-full flex flex-col relative">
              {/* Toggle Button - Centered */}
              <div className='absolute top-1/2 -right-8 transform -translate-y-1/2 h-14 w-8 bg-white flex items-center justify-center rounded-r-full shadow-lg'>
                {isSideBarOpen ? (
                  <motion.svg
                    onClick={() => setIsSideBarOpen(false)}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#a8738b] cursor-pointer hover:text-[#9d92f] transition-colors"
                  >
                    <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z"/>
                  </motion.svg>
                ) : (
                  <motion.svg
                    onClick={() => setIsSideBarOpen(true)}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="27" 
                    height="27" 
                    viewBox="0 0 24 24"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#a8738b] cursor-pointer hover:text-[#9d92f] transition-colors"
                  >
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </motion.svg>
                )}
              </div>

              {/* Header */}
              <div className="p-4 border-b border-[#a8738b]/20">
                <h2 className="text-xl font-semibold text-[#a8738b]">Students</h2>
              </div>

              {/* Students List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {students.map((student) => (
                    <motion.div
                      key={student.studentId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStudentSelect(student)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedStudent?.studentId === student.studentId
                          ? 'bg-[#eba1c2]/30'
                          : 'hover:bg-[#eba1c2]/10'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#a8738b] flex items-center justify-center text-white font-semibold text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        {student.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {student.studentId}
                        </h3>
                        {student.lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {student.lastMessage}
                          </p>
                        )}
                      </div>
                      {student.unreadCount > 0 && (
                        <div className="flex items-center justify-center w-6 h-6 bg-[#a8738b] text-white text-xs font-bold rounded-full">
                          {student.unreadCount}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 