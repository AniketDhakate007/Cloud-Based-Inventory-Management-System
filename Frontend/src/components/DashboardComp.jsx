import React, { useState, useEffect, useMemo } from "react";
import { getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
import { motion } from "framer-motion";
import ProductManager from "./ProductManager";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function Dashboard({ user, signOut }) {
  const [shopId, setShopId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setShopId(currentUser.userId);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleProductsUpdate = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  // Memoize stats to prevent recalculation on every render
  const stats = useMemo(() => [
    {
      label: "Total Products",
      value: products.length,
      icon: "📦",
    },
    {
      label: "Low Stock Items",
      value: products.filter((p) => p.StockLevel < 10).length,
      icon: "⚠️",
    },
    {
      label: "Out of Stock",
      value: products.filter((p) => p.StockLevel === 0).length,
      icon: "❌",
    },
  ], [products]);

  return (
      <div className="fixed inset-0 bg-gray-950 text-white flex flex-col will-change-transform">
        {/* Sign Out Button - Top Right */}
        <div className="absolute top-6 right-6 z-50 pointer-events-auto">
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg"
              onClick={signOut || amplifySignOut}
          >
            Sign Out
          </motion.button>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full pb-8 will-change-scroll">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8 border-b border-gray-800 flex-shrink-0">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-400">
                Welcome back, <span className="text-red-500 font-semibold">{user?.username || "User"}</span>
              </p>
            </div>
          </div>

          {/* Content Area - Full Width */}
          <div className="w-full px-8 py-8 space-y-8">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                  <div
                      key={idx}
                      className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-lg p-6 transition-all flex-shrink-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                        <p className="text-4xl font-bold">{stat.value}</p>
                      </div>
                      <span className="text-4xl">{stat.icon}</span>
                    </div>
                  </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex-shrink-0">
                <h3 className="text-lg font-bold mb-4">Stock Levels by Product</h3>
                {products.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={products}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
                        <XAxis
                            dataKey="ProductName"
                            stroke="rgb(156, 163, 175)"
                            style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="rgb(156, 163, 175)" style={{ fontSize: "12px" }} />
                        <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(20, 28, 45, 0.95)",
                              border: "1px solid rgb(239, 68, 68)",
                              borderRadius: "8px",
                              color: "rgb(255, 255, 255)",
                            }}
                            cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
                        />
                        <Bar
                            dataKey="StockLevel"
                            fill="rgb(239, 68, 68)"
                            radius={[8, 8, 0, 0]}
                            isAnimationActive={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                )}
              </div>

              {/* Line Chart */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex-shrink-0">
                <h3 className="text-lg font-bold mb-4">Stock Distribution</h3>
                {products.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={products}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
                        <XAxis
                            dataKey="ProductName"
                            stroke="rgb(156, 163, 175)"
                            style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="rgb(156, 163, 175)" style={{ fontSize: "12px" }} />
                        <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(20, 28, 45, 0.95)",
                              border: "1px solid rgb(239, 68, 68)",
                              borderRadius: "8px",
                              color: "rgb(255, 255, 255)",
                            }}
                            cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="StockLevel"
                            stroke="rgb(239, 68, 68)"
                            strokeWidth={2}
                            dot={{ fill: "rgb(239, 68, 68)", r: 4 }}
                            isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                )}
              </div>
            </div>

            {/* Product Manager Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex-shrink-0">
              <h3 className="text-lg font-bold mb-6">Manage Products</h3>
              <ProductManager
                  shop={{ shopName: "Your Shop", shopId }}
                  onProductsLoaded={handleProductsUpdate}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
