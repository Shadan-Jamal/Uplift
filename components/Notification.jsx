"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import SOCKET_URL from '../lib/config.js';

export default function Notification() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const socketUrl = SOCKET_URL.SOCKET_URL;
    console.log('Connecting to socket for notifications:', socketUrl);
    const socket = io(socketUrl, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Listen for new message notifications
    socket.on('new_message_notification', (data) => {
      console.log('Received notification:', data);
      console.log('Current session user:', session.user);
      
      // Determine the correct user identifier based on user type
      const currentUserId = session.user.type === 'counselor' ? session.user.email : session.user.id;
      console.log('Checking notification for user:', currentUserId);
      
      if (data.receiverId === currentUserId) {
        console.log('Creating notification for user:', currentUserId);
        const notification = {
          id: Date.now(),
          type: 'message',
          message: `You have received a message from ${data.senderName || data.senderId}`,
          timestamp: new Date(),
          read: false,
          senderType: data.senderType,
          receiverType: data.receiverType
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      } else {
        console.log('Notification not for current user:', {
          receiverId: data.receiverId,
          currentUserId: currentUserId
        });
      }
    });

    // Listen for new event notifications
    socket.on('new_event_notification', (data) => {
      console.log('Received event notification:', data);
      const notification = {
        id: Date.now(),
        type: 'event',
        message: `A new event has been posted: ${data.eventName}`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      console.log('Disconnecting notification socket');
      socket.disconnect();
    };
  }, [session]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-[#a8738b] hover:text-[#9d92f] transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#a8738b] hover:text-[#9d92f]"
                >
                  Mark all as read
                </button>
                <button
                  onClick={clearNotifications}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Clear all
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                      !notification.read ? 'bg-[#a8738b]/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 