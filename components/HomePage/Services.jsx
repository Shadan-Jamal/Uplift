"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Services() {
  const services = [
    {
      title: "Professional Dialogue",
      description: "Connect with experienced counselors for personalized support and guidance through confidential one-on-one sessions.",
      image: "/dialogue.jpeg",
      delay: 0.2
    },
    {
      title: "Mental Health Events",
      description: "Join engaging workshops and awareness programs designed to promote holistic well-being and mental health awareness.",
      image: "/event.png",
      delay: 0.4
    },
    {
      title: "Self-Screening",
      description: "Take a comprehensive mental health assessment to better understand your emotional well-being and get personalized recommendations.",
      image: "/test.png",
      delay: 0.6
    }
  ];

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/50 to-white"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#a8738b] mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Discover the tools and support you need for your mental well-being journey
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: service.delay }}
              className="relative group"
            >
              {/* Service Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border-2 border-[#a8738b]/20 hover:border-[#a8738b]/40 transition-all duration-300">
                {/* Image */}
                <div className="relative w-full h-56 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#a8738b]/10 to-purple-100/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      priority={index < 3}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#a8738b]">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#a8738b]/5 transform rotate-45 translate-x-8 -translate-y-8"></div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a8738b]/0 to-purple-100/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
