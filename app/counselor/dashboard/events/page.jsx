"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import EventCard from '../../../../components/EventCard';
import EventForm from '../../../../components/EventForm';
import Modal from '../../../../components/Modal';
import { toast } from 'react-hot-toast';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockEvents = [
        {
          _id: '1',
          title: 'Stress Management Workshop',
          description: 'Learn effective techniques to manage stress in your daily life.',
          venue: 'Main Conference Room',
          date: '2024-03-25',
        },
        {
          _id: '2',
          title: 'Group Therapy Session',
          description: 'Join our supportive group therapy session to share experiences and gain insights.',
          venue: 'Therapy Room 2',
          date: '2024-03-28',
        },
        {
          _id: '3',
          title: 'Mindfulness Meditation',
          description: 'Practice mindfulness meditation techniques to improve focus and reduce anxiety.',
          venue: 'Meditation Hall',
          date: '2024-04-05',
        },
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Open modal for adding a new event
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Handle form submission (add or update)
  const handleSubmitEvent = (formData) => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event._id === editingEvent._id 
          ? { ...event, ...formData } 
          : event
      );
      setEvents(updatedEvents);
      toast.success('Event updated successfully');
    } else {
      // Add new event
      const newEvent = {
        _id: Date.now().toString(),
        ...formData
      };
      setEvents([newEvent, ...events]);
      toast.success('Event added successfully');
    }
    
    handleCloseModal();
  };

  // Delete an event
  const handleDeleteEvent = (id) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    setEvents(events.filter(event => event._id !== id));
    toast.success('Event deleted successfully');
  };

  return (
    <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/counselor/dashboard" className="text-[#a8738b] hover:text-[#9d92f] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Events Management</h1>
          </div>
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors shadow-md"
          >
            Add New Event
          </button>
        </div>

        {/* Events List */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              No events found. Add your first event!
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <EventCard
                  key={event._id}
                  title={event.title}
                  description={event.description}
                  venue={event.venue}
                  date={event.date}
                  onEdit={() => handleEditEvent(event)}
                  onDelete={() => handleDeleteEvent(event._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
      >
        <EventForm
          event={editingEvent}
          onSubmit={handleSubmitEvent}
          onCancel={handleCloseModal}
        />
      </Modal>
    </section>
  );
} 