"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AffirmationsPage() {
  const [viewMode, setViewMode] = useState('view');
  const [newAffirmation, setNewAffirmation] = useState('');
  const [affirmations, setAffirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAffirmation, setEditingAffirmation] = useState(null);

  // Fetch all affirmations
  const fetchAffirmations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/affirmations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch affirmations');
      }
      
      const data = await response.json();
      setAffirmations(data);
    } catch (error) {
      console.error('Error fetching affirmations:', error);
      toast.error('Failed to load affirmations');
    } finally {
      setLoading(false);
    }
  };

  // Load affirmations on component mount
  useEffect(() => {
    fetchAffirmations();
  }, []);

  // Add a new affirmation
  const handleAddAffirmation = async () => {
    if (newAffirmation.trim() === '') {
      toast.error('Please enter an affirmation');
      return;
    }
    
    try {
      const response = await fetch('/api/affirmations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newAffirmation }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add affirmation');
      }
      
      const data = await response.json();
      setAffirmations([data, ...affirmations]);
      setNewAffirmation('');
      setViewMode('view');
      toast.success('Affirmation added successfully');
    } catch (error) {
      console.error('Error adding affirmation:', error);
      toast.error('Failed to add affirmation');
    }
  };

  // Delete an affirmation
  const handleDeleteAffirmation = async (id) => {
    if (!confirm('Are you sure you want to delete this affirmation?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/affirmations?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete affirmation');
      }
      
      setAffirmations(affirmations.filter(a => a._id !== id));
      toast.success('Affirmation deleted successfully');
    } catch (error) {
      console.error('Error deleting affirmation:', error);
      toast.error('Failed to delete affirmation');
    }
  };

  // Start editing an affirmation
  const handleEditClick = (affirmation) => {
    setEditingAffirmation(affirmation);
    setNewAffirmation(affirmation.text);
    setViewMode('add');
  };

  // Update an affirmation
  const handleUpdateAffirmation = async () => {
    if (newAffirmation.trim() === '') {
      toast.error('Please enter an affirmation');
      return;
    }
    
    try {
      const response = await fetch('/api/affirmations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: editingAffirmation._id, 
          text: newAffirmation 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update affirmation');
      }
      
      const updatedAffirmation = await response.json();
      
      setAffirmations(affirmations.map(a => 
        a._id === updatedAffirmation._id ? updatedAffirmation : a
      ));
      
      setNewAffirmation('');
      setEditingAffirmation(null);
      setViewMode('view');
      toast.success('Affirmation updated successfully');
    } catch (error) {
      console.error('Error updating affirmation:', error);
      toast.error('Failed to update affirmation');
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAffirmation) {
      handleUpdateAffirmation();
    } else {
      handleAddAffirmation();
    }
  };

  return (
    <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* View Mode Toggle */}
        <div className="flex justify-end gap-2 mb-8">
          <button
            onClick={() => {
              setViewMode('add');
              setEditingAffirmation(null);
              setNewAffirmation('');
            }}
            className={`cursor-pointer hover:scale-105 ease-in-out px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'add' 
                ? 'bg-[#a8738b] text-white shadow-md' 
                : 'bg-white text-[#a8738b] hover:bg-[#a8738b]/10'
            }`}
          >
            Add New
          </button>
          <button
            onClick={() => {
              setViewMode('view');
              setEditingAffirmation(null);
              setNewAffirmation('');
            }}
            className={`cursor-pointer hover:scale-105 ease-in-out px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'view' 
                ? 'bg-[#a8738b] text-white shadow-md' 
                : 'bg-white text-[#a8738b] hover:bg-[#a8738b]/10'
            }`}
          >
            View All
          </button>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {viewMode === 'add' ? (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-xl font-semibold text-[#a8738b] mb-4">
                    {editingAffirmation ? 'Edit Affirmation' : 'Add New Affirmation'}
                  </h2>
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                      type="text"
                      value={newAffirmation}
                      onChange={(e) => setNewAffirmation(e.target.value)}
                      placeholder="Enter a new affirmation..."
                      className="flex-1 px-4 py-2 border border-gray-200 text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="hover:scale-105 ease-in-out cursor-pointer px-6 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors"
                    >
                      {editingAffirmation ? 'Update' : 'Add'}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Affirmations Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading affirmations...</div>
            ) : affirmations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No affirmations found. Add your first one!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#a8738b]/10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#a8738b] uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#a8738b] uppercase tracking-wider">
                        Affirmation
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#a8738b] uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {affirmations.map((affirmation, index) => (
                      <tr key={affirmation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center justify-between">
                            <div className="max-w-md truncate" title={affirmation.text}>
                              {affirmation.text}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEditClick(affirmation)}
                                className="hover:cursor-pointer p-1 hover:bg-[#a8738b]/30 rounded-full ease-in-out duration-75 text-[#a8738b] hover:text-[#9d92f] transition-colors"
                                aria-label="Edit affirmation"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteAffirmation(affirmation._id)}
                                className="hover:cursor-pointer p-1 hover:bg-red-500/30 rounded-full text-red-500 hover:text-red-700 transition-colors"
                                aria-label="Delete affirmation"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(affirmation.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 