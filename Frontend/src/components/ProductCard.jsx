import React from "react";

export default function ProductCard({ product, onUpdate }) {
  const handleIncrease = () => onUpdate(product.id, product.stock + 1);
  const handleDecrease = () =>
    product.stock > 0 && onUpdate(product.id, product.stock - 1);

  const isLowStock = product.stock <= product.threshold;

  return (
    <div
      className={`p-4 rounded-xl shadow-md border ${
        isLowStock
          ? "bg-red-50 border-red-300"
          : "bg-white border-gray-200"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {product.name}
      </h3>
      <p className="text-gray-700 mb-1">Stock: {product.stock}</p>
      <p className="text-gray-700 mb-3">
        Reorder Threshold: {product.threshold}
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleDecrease}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          −
        </button>
        <button
          onClick={handleIncrease}
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
        >
          +
        </button>
      </div>

      {isLowStock && (
        <p className="text-red-600 font-medium mt-2">⚠️ Low stock! Reorder soon</p>
      )}
    </div>
  );
}
