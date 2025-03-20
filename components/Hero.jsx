"use client";

import { stagger } from "framer-motion";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import Quotes from "./Quotes";

export default function Hero() {
    const [titleLine, titleLineAnimate] = useAnimate();
    const [title, titleAnimate] = useAnimate();
    const [content, contentAnimate] = useAnimate();

    useEffect(() => {
        const animate = async () => {
            await titleLineAnimate(titleLine.current, 
                { width: "100%" }, 
                { duration: 1, type: "spring", ease: "easeIn" }
            );
            await titleAnimate("span", 
                { y: 0, opacity: 1 }, 
                { delay: stagger(0.1), duration: 0.5 }
            );
            await contentAnimate(content.current,
                { opacity: 1, y: 0 },
                { duration: 0.8, delay: 0.5 }
            );
        };

        animate();
    }, []);

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center gap-12 py-20">
                {/* Main content */}
                <div className="flex flex-col items-center gap-8">
                    {/* Logo and Title */}
                    <div className="relative flex items-center gap-6">
                        <div className="relative w-24 h-24">
                            <Image 
                                src="/cats12-Photoroom.png" 
                                alt="Mental Health Support" 
                                fill
                                className="object-contain drop-shadow-lg"
                                priority
                            />
                        </div>
                        <div ref={title} className="flex flex-row gap-2 text-6xl md:text-7xl font-bold text-indigo-900 overflow-hidden">
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                className="text-indigo-600"
                            >U</motion.span>
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                className="text-indigo-600"
                            >P</motion.span>
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                className="text-indigo-600"
                            >L</motion.span>
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                className="text-indigo-600"
                            >I</motion.span>
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                className="text-indigo-600"
                            >F</motion.span>
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                className="text-indigo-600"
                            >T</motion.span>
                        </div>
                        <motion.div
                            ref={titleLine}
                            initial={{ width: 0 }}
                            className="h-1 absolute bottom-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        />
                    </div>

                    {/* Department Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full border-2 border-indigo-200 shadow-lg"
                    >
                        <p className="text-sm font-semibold text-indigo-900 tracking-wide">
                            Department of Psychology • Claret College
                        </p>
                    </motion.div>

                    {/* Quote Section with Enhanced Styling */}
                    <div ref={content} className="w-full max-w-3xl mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-100">
                        <div className="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" className="text-indigo-600" fill="none">
                                <path d="M14 16C14 14.1144 14 13.1716 14.5858 12.5858C15.1716 12 16.1144 12 18 12C19.8856 12 20.8284 12 21.4142 12.5858C22 13.1716 22 14.1144 22 16C22 17.8856 22 18.8284 21.4142 19.4142C20.8284 20 19.8856 20 18 20C16.1144 20 15.1716 20 14.5858 19.4142C14 18.8284 14 17.8856 14 16Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M14 16V11.8626C14 8.19569 16.5157 5.08584 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M2 16C2 14.1144 2 13.1716 2.58579 12.5858C3.17157 12 4.11438 12 6 12C7.88562 12 8.82843 12 9.41421 12.5858C10 13.1716 10 14.1144 10 16C10 17.8856 10 18.8284 9.41421 19.4142C8.82843 20 7.88562 20 6 20C4.11438 20 3.17157 20 2.58579 19.4142C2 18.8284 2 17.8856 2 16Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M2 16V11.8626C2 8.19569 4.51571 5.08584 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="text-lg text-indigo-900 font-medium">
                                <Quotes />
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-4 mt-4"
                    >
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#services"
                            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Our Services
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#contact"
                            className="px-8 py-3 bg-white text-indigo-600 rounded-full text-sm font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Contact Us
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}