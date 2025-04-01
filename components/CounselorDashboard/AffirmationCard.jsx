"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AffirmationCard() {
  const [affirmation, setAffirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/affirmations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: affirmation }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Affirmation added successfully!');
        setAffirmation('');
      } else {
        setMessage(data.error || 'Failed to add affirmation');
      }
    } catch (error) {
      setMessage('Error adding affirmation');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage('');
      },3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#a8738b]"
    >
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={affirmation}
            onChange={(e) => setAffirmation(e.target.value)}
            placeholder="Enter a positive affirmation..."
            className="w-full p-3 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
            rows="4"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Affirmation'}
        </motion.button>

        {message && (
          <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </motion.div>
  );
} 