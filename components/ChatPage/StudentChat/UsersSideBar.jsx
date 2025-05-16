"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { faculty as staticFaculty } from '../../../public/faculty/faculty.js';
import { useState, useEffect } from 'react';
import SOCKET_URL from '../../../lib/config.js';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';

export default function UsersSideBar({ 
  isSideBarOpen, 
  setIsSideBarOpen,
  selectedFaculty, 
  onSelectFaculty, 
}) {
  const { data: session } = useSession();
  const [facultyConversations, setFacultyConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineFaculty, setOnlineFaculty] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);

  // Mark messages as read when a faculty is selected
  const markMessagesAsRead = async (facultyId) => {
    if (!session?.user?.id || !facultyId) return;
    try {
      const response = await fetch('/api/chat/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: session.user.id, facultyId })
      });
      if (response.ok) {
        setUnreadCounts(prev => ({ ...prev, [facultyId]: 0 }));
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Handle faculty selection
  const handleFacultySelect = async (faculty) => {
    onSelectFaculty(faculty);
    setIsSideBarOpen(false);
    await markMessagesAsRead(faculty.email);
  };

  // Fetch faculty conversations (if any) from the API
  useEffect(() => {
    if (!session) return;
    const fetchFacultyConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/messages?studentId=${session.user.id}&allFaculty=1`);
        if (response.ok) {
          const data = await response.json();
          setFacultyConversations(data);
          const counts = {};
          data.forEach(f => { counts[f.facultyId] = f.unreadCount || 0; });
          setUnreadCounts(counts);
        }
      } catch (error) {
         console.error('Error fetching faculty conversations:', error);
      } finally {
         setLoading(false);
      }
    };
    fetchFacultyConversations();
    const interval = setInterval(fetchFacultyConversations, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Socket for real-time updates (online status and new messages)
  useEffect(() => {
    if (!session) return;
    const socketUrl = SOCKET_URL.SOCKET_URL;
    const newSocket = io(socketUrl, { cors: { origin: '*', methods: ['GET', 'POST'], credentials: true }, reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000, timeout: 10000 });
    setSocket(newSocket);
    newSocket.emit('user_connected', { userId: session.user.id, userType: 'student' });
    newSocket.on('counselor_status_change', (onlineFacultyIds) => {
      setOnlineFaculty(new Set(onlineFacultyIds));
    });
    newSocket.on('receive_message', (message) => {
      if (message.studentId === session.user.id) {
        setUnreadCounts(prev => ({ ...prev, [message.facultyId]: (prev[message.facultyId] || 0) + 1 }));
        setFacultyConversations(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(f => f.facultyId === message.facultyId);
          if (idx !== -1) {
            const faculty = updated[idx];
            updated.splice(idx, 1);
            updated.unshift({ ...faculty, lastMessage: message.text, lastMessageTime: new Date().toISOString() });
          }
          return updated;
        });
      }
    });
    return () => { newSocket.disconnect(); };
  }, [session]);

  // Merge static faculty list with dynamic faculty conversation data (if any)
  const facultyList = staticFaculty.map(f => {
    const conv = facultyConversations.find(c => c.facultyId === f.email);
    if (conv) {
       return { ...f, unreadCount: conv.unreadCount, lastMessage: conv.lastMessage, lastMessageTime: conv.lastMessageTime, conversationId: conv.conversationId };
    } else {
       return { ...f, unreadCount: 0, lastMessage: null, lastMessageTime: null, conversationId: null };
    }
  });

  // Sort faculty so that faculty with a conversation (and a lastMessageTime) are on top, sorted by lastMessageTime
  facultyList.sort((a, b) => {
    if (a.lastMessageTime && b.lastMessageTime) {
       return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    } else if (a.lastMessageTime) return -1;
    else if (b.lastMessageTime) return 1;
    else return 0;
  });

  if (loading) {
    return (
      <div className="w-1/4 h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b]"></div>
      </div>
    );
  }

  // Desktop view
  if(typeof window !== 'undefined' && window.innerWidth > 800) {
    return (
      <div className="w-1/4 h-full bg-white/90 backdrop-blur-3xl border-r border-[#a8738b]/20 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#a8738b] mb-4">Available Faculty</h2>
          <div className="space-y-2">
            {facultyList.map((faculty) => (
              <motion.div
                key={faculty.email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFacultySelect(faculty)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedFaculty?.email === faculty.email ? 'bg-[#eba1c2]/30' : 'hover:bg-[#eba1c2]/10'}`}
              >
                <div className="relative">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={faculty.image} alt={faculty.name} fill className="object-cover" />
                  </div>
                  {onlineFaculty.has(faculty.email) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{faculty.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{faculty.designation}</p>
                </div>
                {faculty.unreadCount > 0 && (
                  <span className="bg-[#a8738b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{faculty.unreadCount}</span>
                )}
              </motion.div>
            ))}
          </div>
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
          className={`fixed top-0 left-0 z-50 min-w-72 h-full bg-amber-600 ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out`}
        >
          {/* Sidebar */}
          <div className="absolute left-0 top-0 bottom-0 w-full bg-white shadow-xl pt-16">
            <div className="h-full flex flex-col relative">
              {/* Toggle Button */}
              <div className='absolute top-1/2 -right-12 transform -translate-y-1/2 h-24 w-12 bg-white flex items-center justify-center rounded-r-full shadow-lg'>
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
                    width="32" 
                    height="32" 
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
                <h2 className="text-xl font-semibold text-[#a8738b]">Available Faculty</h2>
              </div>

              {/* Faculty List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {facultyList.map((faculty) => (
                    <motion.div
                      key={faculty.email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFacultySelect(faculty)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedFaculty?.email === faculty.email ? 'bg-[#eba1c2]/30' : 'hover:bg-[#eba1c2]/10'}`}
                    >
                      <div className="relative">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image src={faculty.image} alt={faculty.name} fill className="object-cover" />
                        </div>
                        {onlineFaculty.has(faculty.email) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{faculty.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{faculty.designation}</p>
                      </div>
                      {faculty.unreadCount > 0 && (
                        <span className="bg-[#a8738b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{faculty.unreadCount}</span>
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