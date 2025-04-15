"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { faculty } from '../../../public/faculty/faculty.js';

export default function UsersSideBar({ selectedFaculty, onSelectFaculty }) {
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
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {member.designation}
                </p>
              </div>
              {/* <div className="w-2 h-2 rounded-full bg-green-500"></div> */}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
