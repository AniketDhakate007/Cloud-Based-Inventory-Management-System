// src/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import shop1 from "./assets/img/199shop.jpg";
import shop2 from "./assets/img/shop2.jpg";
import shop3 from "./assets/img/shop3.jpg";

const Home = () => {
  const navigate = useNavigate();

  const shops = [
    { id: 1, name: "Shop 199", desc: "Groceries & Essentials", image: shop1 },
    { id: 2, name: "FreshMart", desc: "Fresh fruits and vegetables", image: shop2 },
    { id: "dailyneeds", name: "Daily Needs", desc: "Household & daily items", image: shop3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken"); // optional
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-10">
      {/* 🚪 Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-full shadow-md transition"
      >
        Logout
      </button>

      {/* 🔖 Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-rose-700 drop-shadow-lg mb-3">
          🧾 Smart Inventory Management
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor shop stocks, update products, and track sales in one place
        </p>
      </div>

      {/* 🛍️ Shops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {shops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800">{shop.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{shop.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
