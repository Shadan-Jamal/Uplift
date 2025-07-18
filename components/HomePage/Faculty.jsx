"use client";

import { motion } from "motion/react";
import { faculty } from "../../public/faculty/faculty.js";
import Image from "next/image";

export default function Faculty() {
  const technicalTeam = ["Mr. Shadan Jamal",
    "Mr. Prem Kumar Choudhary",
    "Mr. Ritesh Sanjay Kulkarni",
    "Mr. Mohammad Parveez",
    "Ms. Krishnapriya",
  ]
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
            <div className="bg-[#eba1c2]/30 backdrop-blur-md rounded-xl overflow-hidden hover:bg-[#ffbef6] transition-all duration-300 w-10/12 md:w-full mx-auto ">
              <div className="relative h-64 w-full rounded-2xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-contain "
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

      {/* Technical Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-20 text-center"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-[#a21caf] mb-6 tracking-tight drop-shadow-lg">
          Technical Team
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {technicalTeam.map((name,idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white shadow-lg rounded-xl px-8 py-4 min-w-[300px] text-lg font-semibold text-black hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer select-none"
            >
              {/* Replace 'Name' with actual names */}
              {name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
