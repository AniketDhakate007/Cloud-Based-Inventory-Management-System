import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-700 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
                {/* Tagline 1 - Small intro */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-gray-400 text-sm uppercase tracking-widest mb-4"
                >
                    Modern Cloud Solution
                </motion.p>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                >
                    Smart Inventory
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
            Management
          </span>
                </motion.h1>

                {/* Feature Taglines */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="space-y-3 mb-12 max-w-3xl"
                >
                    <p className="text-gray-300 text-lg md:text-xl">
                        Real-time tracking across multiple locations
                    </p>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Intelligent demand forecasting & stock alerts
                    </p>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Seamless integration with all your sales channels
                    </p>
                </motion.div>

                {/* Single CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="px-12 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-full shadow-2xl transition-all duration-300"
                >
                    Get Started
                </motion.button>

                {/* Bottom Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-gray-500 text-sm mt-12 max-w-2xl"
                >
                    Manage your inventory smarter with cloud-based analytics,
                    automated reordering, and comprehensive reporting — all from one dashboard
                </motion.p>
            </div>

            {/* Subtle Footer Text */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-gray-600 text-xs">
                © {new Date().getFullYear()} SmartInventory. Cloud-powered inventory excellence.
            </div>
        </div>
    );
};

export default Landing;
