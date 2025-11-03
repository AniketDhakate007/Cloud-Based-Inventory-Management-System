import React, { useState } from "react";

export default function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || stock === "" || threshold === "") {
      alert("Please fill all fields");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      stock: parseInt(stock),
      threshold: parseInt(threshold),
    };

    onAdd(newProduct);
    setName("");
    setStock("");
    setThreshold("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl shadow-md p-4 mb-6 max-w-sm"
    >
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        ➕ Add New Product
      </h3>

      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        placeholder="Initial stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        placeholder="Reorder threshold"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
      >
        Add Product
      </button>
    </form>
  );
}
