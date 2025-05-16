"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { events_data } from "../data/events-data";

export default function Events() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events_data.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + events_data.length) % events_data.length);
  };

  return (
    <div className="min-h-[50dvh] md:min-h-[90dvh] w-full relative overflow-hidden bg-gray-100">
      <header className="text-4xl md:text-4xl lg:text-6xl w-full text-center py-4 text-black">
        <span className="text-purple-700">CARE</span> Events
      </header>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute min-w-[75%] h-full flex items-center justify-center"
          >
            <div className="relative min-w-96 md:min-w-4xl mx-auto px-4">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  quality={100}
                  src={events_data[currentIndex].src}
                  alt={events_data[currentIndex].description}
                  fill
                  className="object-contain rounded-lg shadow-2xl bg-blend-color-burn"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-10 md:bottom-28 left-0 right-0 flex justify-center gap-2">
        {events_data.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
