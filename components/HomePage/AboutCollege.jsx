"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutCollege() {
  return (
    <section className="relative min-h-[100dvh] w-full bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-12"
        >
          {/* Title Section */}
          <div className="w-full max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              About St. Claret College
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-[#a8738b] to-[#9d92f] mx-auto rounded-full"
            />
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image 
                src="/Colleg-front-view.jpg" 
                alt="St. Claret College Front View"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-bold text-[#a8738b]">St. Claret College, Autonomous</span> was established in 2005 by the International Missionary Congregation of Claretians who manage two universities and over 150 educational institutions in 70 countries around the world. SCC is recognized by UGC, permanently affiliated to Bangalore University, AICTE Approved and NAAC accredited with A+ Grade.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                SCC offers value based education to transform students to be enlightened leaders and networkers who bring about a civilization of love and harmony. In addition to the regular curriculum, students receive specialized training from professional bodies to enhance their skills in group discussions, teamwork, and leadership. This training equips them with the competencies needed to secure suitable positions in the corporate world.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
