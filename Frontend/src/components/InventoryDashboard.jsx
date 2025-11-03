import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    { name: "Sugar 1kg", stock: 3, threshold: 5, image: "../src/assets/img/sugar.jpg" },
    { name: "Salt 500g", stock: 8, threshold: 5, image: "../src/assets/img/salt.jpg" },
    { name: "Wheat Flour 5kg", stock: 2, threshold: 4, image: "../src/assets/img/ashirvad.jpg" },
    { name: "Rice 10kg", stock: 10, threshold: 6, image: "../src/assets/img/rice2.jpg" },
    { name: "GoldWinner 10ltr", stock:20 , threshold: 6, image: "../src/assets/img/doldwinner.png" },
    { name: "KashmiriChilli 10kg", stock: 10, threshold: 6, image: "../src/assets/img/chilli.webp" },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    threshold: "",
    imageFile: null,
    preview: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // 🧮 Update stock
  const updateStock = (index, delta) => {
    const updated = [...products];
    updated[index].stock += delta;
    if (updated[index].stock < 0) updated[index].stock = 0;
    setProducts(updated);
  };

  // 🗑️ Remove product
  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // 🖼️ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewProduct({
        ...newProduct,
        imageFile: file,
        preview: previewURL,
      });
    }
  };

  // ➕ Add new product
  const addProduct = () => {
    if (!newProduct.name || !newProduct.stock || !newProduct.threshold) {
      alert("Please fill all fields!");
      return;
    }

    const imageToUse = newProduct.preview || "/placeholder.jpg";
    setProducts([
      ...products,
      {
        name: newProduct.name,
        stock: parseInt(newProduct.stock),
        threshold: parseInt(newProduct.threshold),
        image: imageToUse,
      },
    ]);

    setNewProduct({
      name: "",
      stock: "",
      threshold: "",
      imageFile: null,
      preview: "",
    });
  };

  // 🔍 Filter search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🚪 Logout
  // 🚪 Logout
const handleLogout = () => {
  // Optional: localStorage.removeItem("isLoggedIn");
  navigate("/Home"); // ✅ Redirect to Home page
};


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative"
      style={{ backgroundImage: "url('/shop.webp')" }}
    >
      {/* 🚪 Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>

      <div className="bg-white bg-opacity-85 rounded-2xl shadow-lg p-6 max-w-7xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-rose-600 mb-8 text-center">
        Shop199
        </h1>

        {/* ➕ Add Product Section */}
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3 text-rose-700">
            ➕ Add New Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Threshold"
              value={newProduct.threshold}
              onChange={(e) =>
                setNewProduct({ ...newProduct, threshold: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded-md"
            />
            <button
              onClick={addProduct}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-md font-semibold transition"
            >
              Add Product
            </button>
          </div>

          {newProduct.preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Preview:</p>
              <img
                src={newProduct.preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mt-2 border"
              />
            </div>
          )}
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-md w-full md:w-1/2 block mx-auto"
          />
        </div>

        {/* 📦 Product Cards */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const isLow = product.stock <= product.threshold;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    {isLow && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 font-medium ${
                        isLow ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      Stock: {product.stock}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Threshold: {product.threshold}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <button
                        onClick={() => updateStock(index, -1)}
                        className="bg-red-500 text-white w-8 h-8 rounded-full text-lg font-bold hover:bg-red-600 transition"
                      >
                        −
                      </button>
                      <button
                        onClick={() => updateStock(index, 1)}
                        className="bg-green-500 text-white w-8 h-8 rounded-full text-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeProduct(index)}
                      className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 rounded-md text-sm font-semibold transition"
                    >
                      🗑️ Remove Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-6">
            ❌ No products found!
          </p>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
