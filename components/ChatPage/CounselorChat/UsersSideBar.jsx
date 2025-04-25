"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import SOCKET_URL from '../../../lib/config.js';


export default function UsersSideBar({ onSelectStudent, selectedStudent }) {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  
  useEffect(() => {
    if (!session) return;
    // Initialize socket connection
    // const socketurl =  'https://care-backend-y23p.onrender.com'
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
    console.log('Connecting to socket at:', socketUrl);
    setSocket(newSocket);

    // Register user with socket
    newSocket.emit('user_connected', {
      userId: session.user.email,
      userType: 'counselor'
    });
    console.log("inside useEffect to check event ")
    // Listen for new student messages
    newSocket.on('new_student_message', async (data) => {
      console.log('Received new_student_message event:', data);
      if (data.facultyId === session.user.email) {
        try {
          setLoading(true);
          const response = await fetch(`/api/chat/students?email=${session.user.email}`);
          if (response.ok) {
            const updatedStudents = await response.json();
            console.log('Updated students list:', updatedStudents);
            setStudents(updatedStudents);
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
  }, [students]);

  useEffect(() => {
    if (!session) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/students?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Initial students data:', data);
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [session]);

  if (loading) {
    return (
      <div className="w-1/4 h-full flex items-center justify-center bg-white/90 backdrop-blur-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a8738b]"></div>
      </div>
    );
  }

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
                onClick={() => onSelectStudent(student)}
              >
                <div className="w-12 h-12 rounded-full bg-[#a8738b] flex items-center justify-center text-white font-semibold text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-md font-medium text-gray-900 truncate">
                    {`${student.studentId}`}
                  </h3>
                </div>
                {/* <div className="w-2 h-2 rounded-full bg-green-500"></div> */}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 