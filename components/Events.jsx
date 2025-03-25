"use client";
import { motion } from "framer-motion";
import { events_data } from "./data/events-data";
import Image from "next/image";
import { useEffect } from "react";

export default function Events() {
  // const controls = useAnimation();

  // useEffect(() => {
  //   const loopAnimation = async () => {
  //     while (true) {
  //       await controls.start({ x: `-${events_data.length * 40}%`, transition: { duration: 10, ease: "linear" } });
  //       controls.set({ x: "0%" });
  //     }
  //   };
  //   loopAnimation();
  // }, [controls]);

  return (
    <section id="events" className="min-h-[60dvh] min-w-[100dvw] container mx-auto px-10 py-20">
      <div className="w-full h-max mb-5">
        <div className="w-fit">
          <h1 className="text-6xl text-black font-bold">Care Events</h1>
        </div>
      </div>
      <div id="image-section" className="w-full px-5 py-7">
        <div className="grid grid-cols-4 grid-flow-row-dense place-content-center place-items-center gap-2">
          {events_data.map((event, index) => (
            <motion.div 
            key={index}
            className="h-fit w-full">
              <Image 
              quality={100} 
              src={event.src} 
              width={400} height={400} 
              className="rounded-lg w-full 
              hover:col-span-2" alt={`Event ${index}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
