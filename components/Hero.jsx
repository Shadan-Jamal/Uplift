"use client";

import { stagger } from "motion";
import { motion,useAnimate } from "motion/react"
import { useEffect } from "react";
import Image from "next/image";
import Quotes from "./Quotes";

export default function Hero () {
    const [titleLine,titleLineAnimate] = useAnimate();
    const [title,titleAnimate] = useAnimate();

    useEffect(() => {
        const titleDraw = async () => {
            await titleLineAnimate(titleLine.current, 
                {width : "100%"}, 
                {duration : 1,type : "spring", ease : "easeIn"} 
            )
            await titleAnimate("span",{y : 0} , { delay: stagger(0.15)})
        }

        titleDraw();
    },[]);
    
  return (
    <section className="grid place-items-center place-content-center gap-10 h-[100dvh] w-full overflow-hidden">
        {/* <div className="">
            <Image src="/SCCLogo.jpeg" alt="hero" width={700} height={600} />
        </div> */}
        <div className="relative w-full max-w-fit max-h-[80dvh]">
            <div ref={title} className="flex flex-row gap-5 text-8xl overflow-hidden">
                <motion.span initial={{y : 100}}>U</motion.span>
                <motion.span initial={{y : 100}}>P</motion.span>
                <motion.span initial={{y : 100}}>L</motion.span>
                <motion.span initial={{y : 100}}>I</motion.span>
                <motion.span initial={{y : 100}}>F</motion.span>
                <motion.span initial={{y : 100}}>T</motion.span>
            </div>
            
            <motion.div
            ref={titleLine} 
            initial={{width : 0}}
            className="h-1 absolute bottom-0 bg-white border">
            </motion.div>
        </div>

        <div className="min-w-fit max-h-fit flex flex-row gap-5">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#2841a0" fill="none">
                    <path d="M14 16C14 14.1144 14 13.1716 14.5858 12.5858C15.1716 12 16.1144 12 18 12C19.8856 12 20.8284 12 21.4142 12.5858C22 13.1716 22 14.1144 22 16C22 17.8856 22 18.8284 21.4142 19.4142C20.8284 20 19.8856 20 18 20C16.1144 20 15.1716 20 14.5858 19.4142C14 18.8284 14 17.8856 14 16Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 16V11.8626C14 8.19569 16.5157 5.08584 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M2 16C2 14.1144 2 13.1716 2.58579 12.5858C3.17157 12 4.11438 12 6 12C7.88562 12 8.82843 12 9.41421 12.5858C10 13.1716 10 14.1144 10 16C10 17.8856 10 18.8284 9.41421 19.4142C8.82843 20 7.88562 20 6 20C4.11438 20 3.17157 20 2.58579 19.4142C2 18.8284 2 17.8856 2 16Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 16V11.8626C2 8.19569 4.51571 5.08584 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            <div>
                <Quotes />
            </div>
        </div>
    </section>
  )
}