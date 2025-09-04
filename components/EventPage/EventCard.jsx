"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

const EventCard = ({
  id,
  title,
  description,
  venue,
  date,
  image,
  imageType,
  link,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="w-full max-h-[30em] overflow-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 md:p-6 mb-4 border border-[#a8738b]/20 hover:border-[#a8738b]/40 transition-all duration-300"
    >
      <div className="flex flex-row gap-6 items-stretch">
        {/* Event Image on the left */}
        {image && (
          <div className="flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden bg-gray-100 border border-[#a8738b]/20">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Details in a column */}
        <div className="flex flex-col flex-wrap flex-1 gap-3 justify-between">
          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg md:text-xl lg:text-3xl font-semibold text-[#a8738b]">{title}</h3>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-[#a8738b] hover:bg-[#a8738b]/10 rounded-lg transition-colors"
                  aria-label="Edit event"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  aria-label="Delete event"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-lg text-balance ">
            {description}
          </p>

          {/* Date, Venue and Links */}
          <div className="flex flex-row gap-6 text-sm text-gray-500 mt-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-[#a8738b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-[#a8738b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{venue}</span>
            </div>
            {link && (
            <div className='w-full flex items-center gap-2'>
              <div
              className='flex items-center gap-2 w-full'
              >

                <span className='flex items-center flex-wrap'>
                  {link.map(link => <a key={link} href={link} target='_blank' rel='noopener noreferrer' className='hover:underline text-xs cursor-pointer'>{link}</a>)
                  }
                  
                </span>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AddMoreLinks = () => {
  const [showInput, setShowInput] = useState(false);
  const [newLink, setNewLink] = useState('');
  const handleAddLink = () => {
    setShowInput(false);
    setNewLink('');
  };
  const handleCancel = () => {
    setShowInput(false);
    setNewLink('');
  };
  return (
    <div className='max-w-[10em] bg-red-600'>
     {showInput ? <div className="flex items-center w-full">
          <input
            type="text"
            className="w-auto h-6 text-xs border border-[#a8738b]/20 rounded-md focus:outline-none focus:border-[#a8738b] text-black bg-white/50 px-2"
            placeholder="Enter link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            required
          />
          <button
            type="button"
            className="cursor-pointer px-2 py-1 bg-[#a8738b] text-white rounded hover:bg-[#9d92f] text-xs transition-colors"
            onClick={handleAddLink}
          >
            Add
          </button>
          <button
            type="button"
            className="cursor-pointer px-2 py-1 bg-[#a8738b] text-white rounded hover:bg-[#9d92f] text-xs transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
       : (
        <button
      type="button"
      className="cursor-pointer ml-2 px-2 py-1 hover:bg-[#a8738b] bg-[#a8738b]/50 text-white rounded text-xs transition-colors"
      onClick={() => setShowInput(true)}
    >
      Add more links
    </button>)}
    </div>
  );
};

export default EventCard;