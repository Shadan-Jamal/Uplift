"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CounselorDashboard() {
  const { data: session } = useSession();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (session?.user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN) {
      setIsSuperAdmin(true);
    }
  }, [session]);

  return (
    <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center gap-12 py-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex items-center gap-6">
            <div className="relative w-32 h-32 md:w-36 md:h-36 lg:w-44 lg:h-44">
              <Image
                quality={100}
                src="/care_logo.png" 
                alt="CARE Logo" 
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="flex flex-row gap-2 text-6xl md:text-7xl font-bold">
              <span className="text-purple-600">C</span>
              <span className="text-purple-600">A</span>
              <span className="text-purple-600">R</span>
              <span className="text-purple-600">E</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Counselor Dashboard
          </h2>
          
        </div>

        {/* Navigation Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isSuperAdmin ? '4' : '3'} gap-8 w-full max-w-7xl`}>
          {/* Affirmations Card */}
          <Link href="/counselor/dashboard/affirmations">
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-[#a8738b]/10 rounded-full flex items-center justify-center group-hover:bg-[#a8738b]/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-[#a8738b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#a8738b]">Affirmations</h3>
                <p className="text-gray-600">Manage and create positive affirmations to support mental well-being.</p>
              </div>
            </motion.div>
          </Link>

          {/* Events Card */}
          <Link href="/counselor/dashboard/events">
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-[#a8738b]/10 rounded-full flex items-center justify-center group-hover:bg-[#a8738b]/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-[#a8738b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#a8738b]">Events</h3>
                <p className="text-gray-600">Schedule and manage therapeutic events, workshops and seminars.</p>
              </div>
            </motion.div>
          </Link>

          {/* Chat Card */}
          <Link href="/counselor/dashboard/chat">
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-[#a8738b]/10 rounded-full flex items-center justify-center group-hover:bg-[#a8738b]/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-[#a8738b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#a8738b]">Chat</h3>
                <p className="text-gray-600">Connect with students through secure and anonymous messaging.</p>
              </div>
            </motion.div>
          </Link>

          {/* Reports Card - Only for Super Admin */}
          {isSuperAdmin && (
            <Link href="/counselor/dashboard/reports">
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-red-500">Reports</h3>
                  <p className="text-gray-600">View and manage student reports submitted by faculties.</p>
                </div>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
} 