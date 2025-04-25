import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EventForm = ({ onClose, onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    console.log(e.target)
    const { name, value } = e.target;
    console.log(name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        venue: '',
        date: '',
      });
      
      // Notify parent component about the new event
      if (onEventAdded) {
        onEventAdded(data.event);
      }
      
      // Close the modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onSubmit={handleSubmit}
      className="space-y-4 min-w-[400px] max-w-lg mx-auto"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50"
          placeholder="Enter event title"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50"
          placeholder="Enter event description"
        />
      </div>
      
      <div>
        <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
          Venue
        </label>
        <input
          type="text"
          id="venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50"
          placeholder="Enter event venue"
        />
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border text-black border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-[#a8738b]/20 rounded-lg text-[#a8738b] hover:bg-[#a8738b]/10 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Event'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EventForm; 