"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Query submitted:", query);
    setQuery("");
  };

  return (
    <footer id="contact" className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* College Address Section */}
          <div className="space-y-4">
            <div className="flex justify-start items-center gap-2">
                <svg fill="#ffffff" width="32px" height="32px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M49,18.92A23.74,23.74,0,0,0,25.27,42.77c0,16.48,17,31.59,22.23,35.59a2.45,2.45,0,0,0,3.12,0c5.24-4.12,22.1-19.11,22.1-35.59A23.74,23.74,0,0,0,49,18.92Zm0,33.71a10,10,0,1,1,10-10A10,10,0,0,1,49,52.63Z"></path></g></svg>
                <h3 className="text-xl font-semibold text-blue-400">
                    Location
                </h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">St. Claret College, Autonomous</p>
              <p className="text-gray-300">Department of Psychology</p>
              <p className="text-gray-300">
                1st Floor, Main Building
              </p>
              <p className="text-gray-300">Bangalore - 560013</p>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-400">Contact Us</h3>
            <div className="space-y-2">
              <p className="text-gray-300">Department Head</p>
              <p className="text-gray-300">Ms. Angela Jean Mary E.</p>
              <p className="text-gray-300">Phone No: +91 9986799828</p>
              <p className="text-gray-300">Email: angela@claretcollege.edu.in</p>
            </div>
          </div>

          {/* Query Form Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-400">Have a Query?</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your query here..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  rows="4"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Send Query
              </motion.button>
            </form>
          </div>

          
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} St. Claret College. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Designed and Developed by the Department of Computer Science, St. Claret College.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 