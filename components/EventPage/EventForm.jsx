import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

const EventForm = ({ onClose, onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    image: null,
    imageType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const portalFileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    console.log("Image selected")
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      input.value = '';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result; // base64 string
      setImagePreview(dataUrl);
      setFormData(prev => ({ ...prev, image: dataUrl, imageType: file.type }));
      setError('');
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  const openPicker = () => {
    const input = portalFileInputRef.current;
    if (!input) return;
    // Ensure input is focusable and visible to the accessibility tree
    input.tabIndex = -1;
    try {
      input.click();
    } catch {
      setTimeout(() => input.click(), 0);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imageType: ''
    }));
    setImagePreview(null);
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
        image: null,
        imageType: ''
      });
      setImagePreview(null);
      
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
      className="space-y-2 md:space-y-4 mx-auto max-w-[20em] md:min-w-[30em] px-2 sm:px-0"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 md:px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50 placeholder:text-sm md:placeholder:text-base text-sm md:text-lg"
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
          className="w-full px-3 sm:px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50 placeholder:text-sm md:placeholder:text-base text-sm md:text-lg"
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
          className="w-full px-3 sm:px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50 placeholder:text-sm md:placeholder:text-base text-sm md:text-lg"
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
          className="w-full px-3 sm:px-4 py-2 border text-black border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50 placeholder:text-sm md:placeholder:text-base text-sm md:text-lg"
        />
      </div>

      

      <div>
        <button
          type="button"
          onClick={openPicker}
          className="cursor-pointer px-3 sm:px-4 py-2 border border-[#a8738b]/20 rounded-lg text-[#a8738b]"
          style={{ pointerEvents: 'auto' }}
        >
          Choose Image 
        </button>
        <span className='text-xs  text-[#a8738b] ms-2'>(Optional)</span>
        {isMounted && createPortal(
          <input
            ref={portalFileInputRef}
            type="file"
            id="event-image-portal"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            // visually hidden; avoid display:none for mobile reliability
            style={{
              position: 'fixed',
              top: '-10000px',
              left: '-10000px',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none'
            }}
          />,
          document.body
        )}
        <p className="text-xs text-gray-500 mt-1">
          Accepted formats: JPEG, PNG, GIF. Max size: 5MB
        </p>
      </div>

      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-[#a8738b]/20"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      //TODO - LINKS
      {/* <div>
        <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-1">
          Links <span className="text-xs text-[#a8738b]">(Optional)</span>
        </label>
        <input
          type="text"
          id="links"
          name="links"
          value={formData.links || ""}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 text-black border border-[#a8738b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent bg-white/50 placeholder:text-sm md:placeholder:text-base text-sm md:text-lg"
          placeholder="Add one or more links, separated by commas"
        />
      </div> */}

      <div className="flex flex-row lg:flex-col justify-end gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onClose}
          className="cursor-pointer px-4 py-2 border border-[#a8738b]/20 rounded-lg text-[#a8738b] hover:bg-[#a8738b]/10 transition-colors w-full sm:w-auto text-sm md:text-base"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="cursor-pointer px-4 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? 'Adding...' : 'Add Event'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EventForm; 