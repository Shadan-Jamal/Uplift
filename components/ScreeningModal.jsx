 "use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ScreeningModal({ isOpen, onClose }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleTakeTest = () => {
    router.push("/screening");
  };

  const handleSkip = () => {
    setShowModal(false);
    onClose();
    // Store in localStorage that user has seen the modal
    localStorage.setItem("screeningModalShown", "true");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border-2 border-[#a8738b]"
      >
        <h2 className="text-2xl font-bold text-[#a8738b] mb-4">
          Welcome to CARE
        </h2>
        <p className="text-gray-600 mb-6">
          To better understand your mental health needs, we recommend taking our
          screening test. This will help us provide you with more personalized
          support and resources.
        </p>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSkip}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Skip for now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTakeTest}
            className="flex-1 px-6 py-3 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors"
          >
            Take Test
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}