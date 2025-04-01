"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AffirmationCard from '../../../components/CounselorDashboard/AffirmationCard';
import EventCard from '../../../components/CounselorDashboard/EventCard';
import ChatCard from '../../../components/CounselorDashboard/ChatCard';

export default function CounselorDashboard() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewMode, setViewMode] = useState({affirmation: 'add', event: 'add'}); // 'add' or 'view'

  const toggleCard = (cardType) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  return (
    <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center gap-12 py-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image 
                src="/cats12-Photoroom.png" 
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

          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Admin Dashboard
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {/* Affirmations Section */}
          <div className="col-span-1">
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border-2 border-[#a8738b]/20"
              layout
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#a8738b]">Affirmations</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode({...viewMode, affirmation: 'add'})}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      viewMode.affirmation === 'add' 
                        ? 'bg-[#a8738b] text-white' 
                        : 'bg-white/50 text-[#a8738b] hover:bg-[#a8738b]/10'
                    }`}
                  >
                    Add New
                  </button>
                  <button
                    onClick={() => setViewMode({...viewMode, affirmation: 'view'})}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      viewMode.affirmation === 'view' 
                        ? 'bg-[#a8738b] text-white' 
                        : 'bg-white/50 text-[#a8738b] hover:bg-[#a8738b]/10'
                    }`}
                  >
                    View All
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {viewMode.affirmation === 'add' ? (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AffirmationCard />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Placeholder for affirmations list */}
                    <div className="bg-white/50 rounded-lg p-4">
                      <p className="text-[#a8738b] font-medium">Daily Motivation</p>
                      <p className="text-sm text-gray-600">Added on: 2024-03-20</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4">
                      <p className="text-[#a8738b] font-medium">Self Care Reminder</p>
                      <p className="text-sm text-gray-600">Added on: 2024-03-19</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Events Section */}
          <div className="col-span-1">
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border-2 border-[#a8738b]/20"
              layout
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#a8738b]">Events</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode({...viewMode, event: 'add'})}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      viewMode.event === 'add' 
                        ? 'bg-[#a8738b] text-white' 
                        : 'bg-white/50 text-[#a8738b] hover:bg-[#a8738b]/10'
                    }`}
                  >
                    Add New
                  </button>
                  <button
                    onClick={() => setViewMode({...viewMode, event: 'view'})}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      viewMode.event === 'view' 
                        ? 'bg-[#a8738b] text-white' 
                        : 'bg-white/50 text-[#a8738b] hover:bg-[#a8738b]/10'
                    }`}
                  >
                    View All
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {viewMode.event === 'add' ? (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EventCard />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Placeholder for events list */}
                    <div className="bg-white/50 rounded-lg p-4">
                      <p className="text-[#a8738b] font-medium">Stress Management Workshop</p>
                      <p className="text-sm text-gray-600">Date: 2024-03-25</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4">
                      <p className="text-[#a8738b] font-medium">Group Therapy Session</p>
                      <p className="text-sm text-gray-600">Date: 2024-03-28</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Chat Section */}
          <div className="col-span-1">
            <ChatCard />
          </div>
        </div>
      </div>
    </section>
  );
} 