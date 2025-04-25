"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function EventCard() {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    venue: '',
    poster: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData(prev => ({ ...prev, poster: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key]);
      });

      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Event added successfully!');
        setEventData({
          name: '',
          description: '',
          date: '',
          venue: '',
          poster: null
        });
        setPreview(null);
      } else {
        setMessage(data.error || 'Failed to add event');
      }
    } catch (error) {
      setMessage('Error adding event');
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
          <input
            type="text"
            value={eventData.name}
            onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Event Name"
            className="w-full p-3 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
            required
          />
        </div>

        <div>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Event Description"
            className="w-full p-3 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
            rows="3"
            required
          />
        </div>

        <div>
          <input
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full p-3 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
            required
          />
        </div>

        <div>
          <input
            type="text"
            value={eventData.venue}
            onChange={(e) => setEventData(prev => ({ ...prev, venue: e.target.value }))}
            placeholder="Event Venue"
            className="w-full p-3 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Event Poster
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 rounded-lg border border-[#a8738b]/20 focus:outline-none focus:border-[#a8738b] text-black bg-white/50"
            required
          />
          {preview && (
            <div className="mt-2 relative h-32 w-full">
              <Image
                src={preview}
                alt="Event poster preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Event'}
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