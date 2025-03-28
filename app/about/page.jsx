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
          The Claret Centre for Mental Well-being (CARE) at St. Claret College (Autonomous), under the aegis of the Department of Psychology, stands as a dedicated hub committed to fostering mental health and overall well-being. It provides a safe and confidential space where students, faculty, and the broader community can access essential mental health services. By addressing critical concerns and bridging gaps in mental health support, CARE ensures that individuals receive the guidance they need in a supportive and understanding environment.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="first-letter:text-3xl first-letter:font-bold text-indigo-900"
        >
          With a broad spectrum of objectives, CARE actively promotes mental health awareness and emotional resilience. It offers personalized counseling services tailored to the unique needs of individuals, providing them with professional guidance to navigate personal and academic challenges. Through life skills development programs, CARE fosters emotional intelligence, resilience, and decision-making abilities, empowering individuals to handle stress and adversity effectively. Its community outreach initiatives aim to break down societal stigma, creating open spaces for dialogue and encouraging people to seek help without hesitation.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="first-letter:text-3xl first-letter:font-bold text-indigo-800"
        >
          To further its mission, CARE regularly organizes workshops, seminars, and educational sessions designed to enhance awareness of mental health issues. These interactive events not only provide knowledge but also cultivate a culture of understanding and empathy. A key highlight of CARE’s efforts is its annual celebration of World Mental Health Day, a vibrant occasion featuring competitions, activities, and creative engagements that promote awareness while fostering a sense of belonging and community. Through these initiatives, CARE becomes more than just a support system—it transforms into a beacon of hope and encouragement, ensuring that mental health is prioritized, respected, and celebrated. As conversations around well-being continue to evolve, CARE remains steadfast in its commitment to creating an inclusive and compassionate environment where no one feels alone on their journey to mental wellness.
        </motion.p>

        {/* <motion.p
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
        </motion.p> */}

      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </section>
  );
}
