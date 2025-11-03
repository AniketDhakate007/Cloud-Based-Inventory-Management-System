import React, { useState } from "react";

const InventoryDashboard = () => {
  const [products, setProducts] = useState([
    { name: "Sugar 1kg", stock: 3, threshold: 5 },
    { name: "Salt 500g", stock: 8, threshold: 5 },
    { name: "Wheat Flour 5kg", stock: 2, threshold: 4 },
    { name: "Rice 10kg", stock: 10, threshold: 6 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    threshold: "",
  });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.stock || !newProduct.threshold) return;
    setProducts([
      ...products,
      {
        ...newProduct,
        stock: Number(newProduct.stock),
        threshold: Number(newProduct.threshold),
      },
    ]);
    setNewProduct({ name: "", stock: "", threshold: "" });
  };

  const updateStock = (index, delta) => {
    const updated = [...products];
    updated[index].stock += delta;
    if (updated[index].stock < 0) updated[index].stock = 0;
    setProducts(updated);
  };

  const getContainerColor = (product) => {
    if (product.stock <= product.threshold / 2) return "bg-red-200 border-red-500";
    if (product.stock <= product.threshold) return "bg-yellow-100 border-yellow-400";
    return "bg-green-100 border-green-400";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 via-indigo-100 to-blue-200 flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581091215367-59ab6e92e6a9?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 shadow-md p-6 flex justify-between items-center border-b border-white/40">
        <h1 className="text-3xl font-bold text-indigo-700">🏪 Smart Inventory Dashboard</h1>
      </header>

      {/* Main Section */}
      <main className="flex-grow p-6 flex flex-col items-center">
        <div className="max-w-6xl w-full backdrop-blur-md bg-white/70 rounded-3xl shadow-xl p-8 border border-white/40">
          {/* Add Product Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
              ➕ Add New Product
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <input
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 w-48 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 w-32 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Threshold"
                value={newProduct.threshold}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, threshold: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 w-36 focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={addProduct}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-blue-600 shadow-lg transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Product Containers */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const containerColor = getContainerColor(product);
              const isLow = product.stock <= product.threshold;

              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-2 ${containerColor} shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300`}
                >
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isLow ? "text-red-700" : "text-gray-800"
                    }`}
                  >
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-gray-700">
                      Stock:{" "}
                      <span
                        className={`${
                          isLow ? "text-red-600" : "text-green-700"
                        } font-bold`}
                      >
                        {product.stock}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-700">
                      Threshold:{" "}
                      <span className="text-gray-800 font-bold">
                        {product.threshold}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => updateStock(index, -1)}
                      className="bg-red-500 text-white w-10 h-10 rounded-full text-xl font-bold hover:bg-red-600 shadow-md transition"
                    >
                      −
                    </button>
                    <button
                      onClick={() => updateStock(index, 1)}
                      className="bg-green-500 text-white w-10 h-10 rounded-full text-xl font-bold hover:bg-green-600 shadow-md transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Low stock message */}
                  {isLow && (
                    <p className="text-center text-red-700 mt-3 font-medium">
                      ⚠️ Low stock! Reorder soon.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-700 bg-white/70 backdrop-blur-sm border-t border-white/50">
        © {new Date().getFullYear()} <b>Smart Inventory Pro</b> — Built with 💜 React + Tailwind
      </footer>
    </div>
  );
};

export default InventoryDashboard;
