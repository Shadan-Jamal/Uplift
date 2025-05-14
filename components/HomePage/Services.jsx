"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Services() {
  const router = useRouter();

  const services = [
    {
      title: "Professional Dialogue",
      description: "Connect with experienced counselors for personalized support and guidance through confidential one-on-one sessions.",
      image: "/dialogue.jpeg",
      delay: 0.2,
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#a8738b] group-hover:text-[#9d92f]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      path: "/chat"
    },
    {
      title: "Mental Health Events",
      description: "Join engaging workshops and awareness programs designed to promote holistic well-being and mental health awareness.",
      image: "/event.png",
      delay: 0.4,
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#a8738b] group-hover:text-[#9d92f]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
        </svg>
      ),
      path: "/events"
    },
    {
      title: "Self-Screening",
      description: "Take a comprehensive mental health assessment to better understand your emotional well-being and get personalized recommendations.",
      image: "/test.png",
      delay: 0.6,
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#a8738b] group-hover:text-[#9d92f]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      ),
      path: "/screening"
    }
  ];

  const handleServiceClick = (path) => {
    router.push(path);
  };

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
              className="relative group cursor-pointer"
              onClick={() => handleServiceClick(service.path)}
            >
              {/* Service Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border-2 border-[#a8738b]/20 hover:border-[#a8738b]/40 transition-all duration-300">
                {/* Icon */}
                <motion.div 
                  className="absolute top-6 right-6 z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <service.icon />
                </motion.div>

                {/* Image */}
                <div className="relative w-full h-56 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#a8738b]/10 to-purple-100/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={index < 3}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#a8738b] group-hover:text-[#9d92f] transition-colors">
                    {service.title}
                  </h3>
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
