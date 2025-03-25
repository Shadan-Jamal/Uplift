"use client";
import { motion, AnimatePresence } from "motion/react";
import { affirmations } from "./data/affirmations"
import { useEffect } from "react";

export default function Affirmation() {
    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
  return (
    <AnimatePresence>
        <motion.div
        initial={{opacity : 0}}
        animate={{opacity : 1}}
        exit={{opacity : 0}}
        transition={{duration : 1, ease : "easeInOut"}}
        className="fixed z-[9999] top-14 lg:top-20 right-5 lg:right-10 px-4 py-3 min-w-24 max-h-[20em] rounded-md bg-rose-300/80 space-y-3">
            <div className="w-full h-fit rounded-b-[2px] border-b-2 border-rose-400 pl-2">
                <h1 className="font-medium text-base text-black">Reminder of the day!</h1>
            </div>
            <div className="max-w-[15em] h-fit pl-2">
                <p className="text-black text-sm font-normal
                text-balance w-full">{affirmation}</p>
            </div>
        </motion.div>
    </AnimatePresence>
  )
}
