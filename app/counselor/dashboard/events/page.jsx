"use client";

import { useState, useEffect } from 'react';
import EventCard from '../../../../components/EventPage/EventCard';
import EventForm from '../../../../components/EventPage/EventForm';
import Modal from '../../../../components/EventPage/Modal';
import { toast } from 'react-hot-toast';
import {motion} from "motion/react"

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle new event addition
  const handleEventAdded = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    toast.success('Event added successfully');
  };

  // Handle event deletion
  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(prev => prev.filter(event => event._id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <section className="relative min-h-[100dvh] w-[100dvw] overflow-hidden bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* Add Event Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f]shadow-md  hover:scale-105 cursor-pointer transition-all ease-in-out"
          >
            Add New Event
          </button>
        </div>

        {/* Events List */}
        <div className="max-w-8xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              No events found.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  title={event.title}
                  description={event.description}
                  venue={event.venue}
                  date={event.date}
                  image={event.image}
                  imageType={event.imageType}
                  link={event.link}
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
        onClose={() => setIsModalOpen(false)}
      >
        <EventForm
          onClose={() => setIsModalOpen(false)}
          onEventAdded={handleEventAdded}
        />
      </Modal>
    </section>
  );
} 