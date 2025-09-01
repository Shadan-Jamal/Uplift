"use client";

import { motion } from 'framer-motion';
import ChatContainer from '../../../../components/ChatPage/CounselorChat/ChatContainer';

export default function ChatPage() {
  return (
    <section className="relative min-h-[100dvh] w-screen overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#f0f4f8] via-[#ffffff] to-[#e8eef5] pt-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 md:pt-3 lg:pt-4 w-screen">
        {/* Content */}
        <div className=" max-w-full max-h-full mx-auto border rounded-lg shadow-lg bg-white/90 backdrop-blur-3xl overflow-hidden">
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