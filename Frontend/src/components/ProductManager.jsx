import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../service/api";

export default function ProductManager({ shop, onProductsLoaded }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    ItemId: "",
    ProductName: "",
    StockLevel: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shop || !shop.shopId) return;
    loadProducts();
  }, [shop.shopId]);

  useEffect(() => {
    if (onProductsLoaded) {
      onProductsLoaded(products);
    }
  }, [products, onProductsLoaded]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(shop.shopId);
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        if (onProductsLoaded) onProductsLoaded(data.products);
      } else {
        setProducts([]);
        setError("No products found or invalid response format.");
      }
    } catch (err) {
      setError("Error loading products: " + err.message);
      setProducts([]);
    }
    setLoading(false);
  }, [shop.shopId, onProductsLoaded]);

  const handleAdd = useCallback(
      async (e) => {
        e.preventDefault();
        setError(null);
        try {
          await addProduct({
            shopId: shop.shopId,
            ItemId: form.ItemId,
            ProductName: form.ProductName,
            StockLevel: parseInt(form.StockLevel),
          });
          setForm({ ItemId: "", ProductName: "", StockLevel: "" });
          loadProducts();
        } catch (err) {
          setError("Error adding product: " + err.message);
        }
      },
      [form, shop.shopId, loadProducts]
  );

  const handleUpdate = useCallback(
      async (e) => {
        e.preventDefault();
        setError(null);
        try {
          await updateProduct(editingProduct.ItemId, shop.shopId, {
            ProductName: form.ProductName,
            StockLevel: parseInt(form.StockLevel),
          });
          setEditingProduct(null);
          setForm({ ItemId: "", ProductName: "", StockLevel: "" });
          loadProducts();
        } catch (err) {
          setError("Error updating product: " + err.message);
        }
      },
      [editingProduct, form, shop.shopId, loadProducts]
  );

  const handleDelete = useCallback(
      async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        setError(null);
        try {
          await deleteProduct(productId, shop.shopId);
          loadProducts();
        } catch (err) {
          setError("Error deleting product: " + err.message);
        }
      },
      [shop.shopId, loadProducts]
  );

  const startEdit = useCallback((product) => {
    setEditingProduct(product);
    setForm({
      ItemId: product.ItemId,
      ProductName: product.ProductName,
      StockLevel: product.StockLevel.toString(),
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingProduct(null);
    setForm({ ItemId: "", ProductName: "", StockLevel: "" });
  }, []);

  if (!shop) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
          Select a shop to manage products
        </div>
    );
  }

  return (
      <div className="space-y-6 flex-shrink-0">
        {/* Error Message */}
        {error && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 text-red-400"
            >
              {error}
            </motion.div>
        )}

        {/* Add / Edit Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4 text-white">
            {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
          </h3>
          <form onSubmit={editingProduct ? handleUpdate : handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                  name="ItemId"
                  value={form.ItemId}
                  onChange={(e) => setForm({ ...form, ItemId: e.target.value })}
                  className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg placeholder-gray-500 focus:border-red-600 focus:outline-none transition-all"
                  placeholder="Product ID"
                  required
                  disabled={editingProduct}
              />
              <input
                  name="ProductName"
                  value={form.ProductName}
                  onChange={(e) => setForm({ ...form, ProductName: e.target.value })}
                  className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg placeholder-gray-500 focus:border-red-600 focus:outline-none transition-all"
                  placeholder="Product Name"
                  required
              />
              <input
                  name="StockLevel"
                  value={form.StockLevel}
                  onChange={(e) => setForm({ ...form, StockLevel: e.target.value })}
                  className="bg-gray-800 border border-gray-700 text-white p-3 rounded-lg placeholder-gray-500 focus:border-red-600 focus:outline-none transition-all"
                  placeholder="Stock Level"
                  type="number"
                  required
              />
            </div>
            <div className="flex gap-3">
              <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                  <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
              <div className="p-8 text-center text-gray-400">
                <p>Loading products...</p>
              </div>
          ) : products.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No products yet. Add your first product above!</p>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="p-4 text-left text-gray-300 font-semibold">Product ID</th>
                    <th className="p-4 text-left text-gray-300 font-semibold">Name</th>
                    <th className="p-4 text-left text-gray-300 font-semibold">Stock Level</th>
                    <th className="p-4 text-left text-gray-300 font-semibold">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {products.map((product, idx) => (
                      <motion.tr
                          key={product.ItemId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.02 }}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4 text-gray-300">{product.ItemId}</td>
                        <td className="p-4 text-gray-300">{product.ProductName}</td>
                        <td className="p-4 text-gray-300">
                      <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              product.StockLevel === 0
                                  ? "bg-red-600/20 text-red-400"
                                  : product.StockLevel < 10
                                      ? "bg-yellow-600/20 text-yellow-400"
                                      : "bg-green-600/20 text-green-400"
                          }`}
                      >
                        {product.StockLevel}
                      </span>
                        </td>
                        <td className="p-4 space-x-2 flex">
                          <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => startEdit(product)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 text-sm rounded-lg font-semibold transition-all"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(product.ItemId)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-lg font-semibold transition-all"
                          >
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
}
