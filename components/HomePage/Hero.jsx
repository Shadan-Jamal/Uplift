"use client";

import { stagger } from "framer-motion";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import Quotes from "./Quotes";
import Affirmation from "./Affirmation";

export default function Hero() {
    // const [titleLine, titleLineAnimate] = useAnimate();
    const [title, titleAnimate] = useAnimate();
    const [content, contentAnimate] = useAnimate();
    const [claretTagline,claretTaglineAnimate] = useAnimate();

    useEffect(() => {
        const animate = async () => {
            // await titleLineAnimate(titleLine.current, 
            //     { width: "100%" }, 
            //     { duration: 1, type: "spring", ease: "easeIn" }
            // );
            await titleAnimate("span", 
                { y: 0, opacity: 1 }, 
                { delay: stagger(0.1), duration: 0.5 }
            );

            await claretTaglineAnimate("div",
                {y : 0,opacity : 1},
                {duration : 0.4, delay : stagger(0.1), ease : "backOut"}
            )
            
            await contentAnimate(content.current,
                { opacity: 1, y: 0 },
                { duration: 0.8, delay: 0.5 }
            );


        };

        animate();
    }, []);

    return (
        <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl">

            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center gap-12 py-20">
                {/* Main content */}
                <div className="flex flex-col items-center gap-8">
                    {/* Logo and Title */}
                    <div className="relative flex items-center gap-6">
                        <div className="relative w-32 h-32">
                            <Image 
                                src="/care_logo.png" 
                                alt="CARE Logo" 
                                fill
                                className="object-contain drop-shadow-lg"
                                priority
                            />
                        </div>
                        <div ref={title} className="flex flex-row gap-2 text-6xl md:text-7xl font-bold overflow-hidden">
                            <motion.span
                                whileHover={{y : -20}}
                                animate={{ y : 0}}
                                className="text-purple-700 hover:cursor-default"
                            >C</motion.span>
                            <motion.span 
                                whileHover={{y : -20}}
                                animate={{ y : 0}}
                                className="text-purple-700 hover:cursor-default"
                            >A</motion.span>
                            <motion.span 
                                whileHover={{y : -20}}
                                animate={{ y : 0}}
                                className="text-purple-700 hover:cursor-default"
                            >R</motion.span>
                            <motion.span 
                                whileHover={{y : -20}}
                                animate={{ y : 0}}
                                className="text-purple-700 hover:cursor-default"
                            >E</motion.span>
                        </div>
                        {/* <motion.div ref={titleLine}
                            initial={{ width: 0 }}
                            className="h-1 absolute bottom-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full"
                        /> */}
                    </div>


                    <div 
                    ref={claretTagline}
                    className="w-[100dvw] h-auto flex flex-wrap justify-center items-center gap-2 lg:gap-5 px-3 py-5 overflow-hidden">
                        {['Claret','Centre','For','Mental','Well-Being'].map((term,idx) => {
                            return <motion.div 
                            key={idx}
                            initial={{y : 100, opacity : 0}}
                            className="w-fit h-fit"
                            >
                                <p className="text-2xl md:text-3xl lg:text-6xl text-purple-400 font-light">{term}</p>
                            </motion.div>
                        })}
                    </div>
                    
                    {/* Department Badge */}
                    <div className="flex flex-row items-center gap-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3}}
                            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full border-2 border-indigo-200 shadow-lg"
                        >
                            <p className="text-md font-semibold text-indigo-900 tracking-wide">
                                Department of Psychology • St. Claret College, Autonomous
                            </p>
                        </motion.div>

                        {/* Affirmation Card */}
                        <Affirmation />
                    </div>
                    {/* Quote Section with Enhanced Styling */}
                    <div ref={content} className="max-w-[80dvw] md:max-w-2xl lg:max-w-3xl mt-3 lg:mt-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-5 lg:p-8 shadow-xl border-2 border-[#a8738b]">
                        <div className="flex items-center gap-4">
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