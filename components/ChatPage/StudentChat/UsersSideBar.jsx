"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { faculty } from '../../../public/faculty/faculty.js';
import { useState, useEffect } from 'react';
import SOCKET_URL from '../../../lib/config.js';
import io from 'socket.io-client';

export default function UsersSideBar({ 
  isSideBarOpen, 
  setIsSideBarOpen,
  selectedFaculty, 
  onSelectFaculty, 
}) {
  const [onlineFaculty, setOnlineFaculty] = useState(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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

    // Listen for faculty status changes
    newSocket.on('counselor_status_change', (onlineFacultyIds) => {
      console.log('Received faculty status change:', onlineFacultyIds);
      setOnlineFaculty(new Set(onlineFacultyIds));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Desktop view
  if(typeof window !== 'undefined') {
    if(window.innerWidth > 800) {
      return (
        <div className="w-1/4 h-full bg-white/90 backdrop-blur-3xl border-r border-[#a8738b]/20 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#a8738b] mb-4">Available Faculty</h2>
          <div className="space-y-2">
            {faculty.map((member) => (
              <motion.div
                key={member.email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectFaculty(member)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedFaculty?.mail === member.mail
                    ? 'bg-[#eba1c2]/30'
                    : 'hover:bg-[#eba1c2]/10'
                }`}
              >
                <div className="relative">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {onlineFaculty.has(member.email) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {member.designation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
    }
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
              <div className='absolute top-5 -right-5 h-fit bg-white flex items-center justify-center rounded-r-full'>
                {isSideBarOpen ?
                <motion.svg
                  onClick={() => setIsSideBarOpen(false)}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#a8738b] cursor-pointer"
                >
                  <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z"/>
                </motion.svg>
                :
                <motion.svg
                  onClick={() => setIsSideBarOpen(true)}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#a8738b] cursor-pointer"
                >
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </motion.svg>}
              </div>

              {/* Header */}
              <div className="p-4 border-b border-[#a8738b]/20">
                <h2 className="text-xl font-semibold text-[#a8738b]">Available Faculty</h2>
              </div>

              {/* Faculty List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {faculty.map((member) => (
                    <motion.div
                      key={member.email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectFaculty(member);
                        setIsSideBarOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFaculty?.mail === member.mail
                          ? 'bg-[#eba1c2]/30'
                          : 'hover:bg-[#eba1c2]/10'
                      }`}
                    >
                      <div className="relative">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {onlineFaculty.has(member.email) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {member.designation}
                        </p>
                      </div>
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