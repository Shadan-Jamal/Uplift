"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function UsersSideBar({ selectedStudent, onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  console.log(session?.user)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/students?counselorMail=${session?.user?.email}`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchStudents();
    }
  }, [session?.user?.email]);

  console.log(students)
  return (
    <div className="w-1/4 h-full bg-white/90 backdrop-blur-3xl border-r border-[#a8738b]/20 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#a8738b] mb-4">Students</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a8738b]"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No students have sent messages yet
          </div>
        ) : (
          <div className="space-y-2">
            {students.map((student) => (
              <motion.div
                key={student.userId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectStudent(student)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedStudent?.userId === student.userId
                    ? 'bg-[#eba1c2]/30'
                    : 'hover:bg-[#eba1c2]/10'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#a8738b] flex items-center justify-center text-white font-semibold text-lg">
                  {student.name?.[0] || student.userId[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {student.name || `Student ${student.userId}`}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {student.email}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 