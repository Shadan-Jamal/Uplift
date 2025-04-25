"use client";

import { motion } from "motion/react";
import { faculty } from "../../public/faculty/faculty.js";
import Image from "next/image";

export default function Faculty() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      {/* Header with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Meet Our Team</h2>
        <p className="text-black/70 text-xl max-w-2xl mx-auto">
          Commited to support mental health and well-being.
        </p>
      </motion.div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {faculty.map((member, index) => (
          <motion.div
            key={member.email}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-[#eba1c2]/30 backdrop-blur-md rounded-xl overflow-hidden hover:bg-[#ffbef6] transition-all duration-300">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <motion.h3 
                  className="text-xl font-semibold text-black mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {member.name}
                </motion.h3>
                
                <motion.p 
                  className="text-black/70 mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {member.designation}
                </motion.p>
                
                <motion.a
                  title={`Email ${member.email}`}
                  href={`mailto:${member.email}`}
                  className="text-black/50 hover:text-black transition-colors duration-200 text-sm hover:"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {member.email}
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
