"use client";

import { motion } from "framer-motion";

export default function Page() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-start py-20 px-4 md:px-8 lg:px-16">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-indigo-900 mb-12 mt-16"
      >
        About Us
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-5xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-xl space-y-6 text-lg leading-relaxed"
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="first-letter:text-3xl first-letter:font-bold text-indigo-900"
        >
          At St. Claret College (SCC) Bangalore, we believe that education is not just about academic success but also about overall well-being. Since our establishment in 2005 by the Claretian Missionaries, we have been committed to creating an environment where students feel supported, valued, and empowered—not just intellectually, but emotionally as well.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-indigo-800"
        >
          We understand that mental health plays a crucial role in shaping a student's journey. College life can be exciting, but it also comes with challenges, pressures, and transitions. That's why we have built a strong support system to help our students navigate these experiences. Our campus is home to professional counseling services, wellness programs, mindfulness sessions, and stress management workshops, all designed to promote emotional resilience and a balanced lifestyle.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-indigo-800"
        >
          Diversity is one of SCC's strengths, with students from different states, countries, cultures, and belief systems coming together as one community. This inclusive atmosphere ensures that every student finds a safe space where they can express themselves freely and seek help when needed.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-indigo-800"
        >
          Our faculty members are more than just educators; they are mentors who genuinely care about the well-being of their students. Their student-centric approach goes beyond academics, offering guidance and encouragement to those facing personal or emotional struggles.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-indigo-800"
        >
          We also integrate mental health awareness into our curriculum and extracurricular activities. Expert-led sessions on emotional intelligence, coping strategies, and self-care help students develop the skills they need to handle stress and challenges effectively.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-indigo-800"
        >
          Nestled within the bustling city of Bengaluru, our lush and peaceful campus provides the perfect escape from daily pressures. Whether it's through meditation spaces, relaxation zones, or recreational activities, we ensure that students have opportunities to unwind and recharge.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="font-medium text-indigo-900"
        >
          At SCC, we firmly believe that a healthy mind is the key to success. We are dedicated to fostering a culture where mental health is prioritized, and students feel empowered to grow, thrive, and achieve their dreams. Welcome to a college experience that cares about you.
        </motion.p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </section>
  );
}
