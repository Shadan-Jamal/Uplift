"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ChatContainer from '../../../../components/ChatPage/CounselorChat/ChatContainer';
// import ChatCard from '../../../../components/CounselorDashboard/ChatCard';

export default function ChatPage() {
  return (
    <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#f0f4f8] via-[#ffffff] to-[#e8eef5] pt-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/counselor/dashboard" className="text-[#a8738b] hover:text-[#9d92f] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Chat</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-full max-h-full mx-auto border rounded-lg shadow-lg bg-white/90 backdrop-blur-3xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChatContainer />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 