"use client";
import Image from "next/image";
import Link from "next/link";
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
          <div className="w-full max-w-7xl mx-auto text-center flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-4">
            <div className="flex justify-center md:justify-end md:w-[50%] md:mr-6 mb-2 md:mb-0">
              <div className="relative w-full h-44 md:w-full md:h-56">
                <Image 
                  src="/SCCLogo.jpeg" 
                  alt="St. Claret College Logo"
                  fill
                  className="object-contain shadow-lg"
                  priority
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center md:w-full md:items-start">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl md:w-full font-bold text-gray-900 mb-2 md:mb-0"
              >
                About St. Claret College
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-[#a8738b] to-[#9d92f] mx-auto rounded-full w-2/3 md:w-full"
              />
            </div>
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
              <p className="hover:underline">
                <Link href={"https://claretcollege.edu.in/"} target="_blank" className="flex items-center gap-2 text-[#a8738b] hover:text-[#9d92f] transition-colors">
                  Visit Claret College
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
