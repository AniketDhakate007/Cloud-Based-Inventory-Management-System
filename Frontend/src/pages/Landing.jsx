import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 min-h-screen flex flex-col text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white bg-opacity-10 backdrop-blur-md shadow-md">
        <h1 className="text-2xl font-bold">SmartInventory</h1>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-6"
        >
          Manage Your Stock <br /> Smarter & Faster
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-xl text-lg opacity-90 mb-8"
        >
          Real-time stock tracking and smart analytics — all in one simple dashboard.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all"
        >
          🚀 Get Started
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm bg-white bg-opacity-10">
        © {new Date().getFullYear()} SmartInventory. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
