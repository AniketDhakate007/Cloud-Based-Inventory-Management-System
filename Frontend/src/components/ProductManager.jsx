
// import React, { useState, useEffect } from "react";
// import { getProducts, addProduct, updateProduct, deleteProduct } from "../service/api";

// export default function ProductManager({ shop }) {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [form, setForm] = useState({ ItemId: "", ProductName: "", StockLevel: "" });
//     const [error, setError] = useState(null);

//     // Fetch products for selected shop
//     useEffect(() => {
//         if (!shop) return;
//         loadProducts();
//     }, [shop]);

//     const loadProducts = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await getProducts(shop.shopId);
//             // assumed response: { products: [ ... ] }
//             if (Array.isArray(data.products)) {
//                 setProducts(data.products);
//             } else {
//                 setProducts([]);
//                 setError("No products found or invalid response format.");
//             }
//         } catch (err) {
//             setError("Error loading products: " + err.message);
//             setProducts([]);
//         }
//         setLoading(false);
//     };

//     const handleAdd = async (e) => {
//         e.preventDefault();
//         setError(null);
//         try {
//             await addProduct({
//                 shopId: shop.shopId,
//                 ItemId: form.ItemId,
//                 ProductName: form.ProductName,
//                 StockLevel: parseInt(form.StockLevel)
//             });
//             setForm({ ItemId: "", ProductName: "", StockLevel: "" });
//             loadProducts();
//         } catch (err) {
//             setError("Error adding product: " + err.message);
//         }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         setError(null);
//         try {
//             await updateProduct(editingProduct.ItemId, shop.shopId, {
//                 ProductName: form.ProductName,
//                 StockLevel: parseInt(form.StockLevel),
//             });
//             setEditingProduct(null);
//             setForm({ ItemId: "", ProductName: "", StockLevel: "" });
//             loadProducts();
//         } catch (err) {
//             setError("Error updating product: " + err.message);
//         }
//     };


//     const handleDelete = async (itemId) => {
//         setError(null);
//         if (!window.confirm("Are you sure you want to delete this product?")) return;
//         try {
//             await deleteProduct(itemId, shop.shopId);
//             loadProducts();
//         } catch (err) {
//             setError("Error deleting product: " + err.message);
//         }
//     };

//     const startEdit = (product) => {
//         setEditingProduct(product);
//         setForm({
//             ItemId: product.ItemId,
//             ProductName: product.ProductName,
//             StockLevel: product.StockLevel.toString(),
//         });
//     };

//     const cancelEdit = () => {
//         setEditingProduct(null);
//         setForm({ ItemId: "", ProductName: "", StockLevel: "" });
//     };

//     if (!shop) {
//         return (
//             <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
//                 ← Select a shop to manage products
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white shadow rounded-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Products in {shop.shopName}</h2>
//             {error && <p className="text-red-600 mb-3">{error}</p>}

//             {/* Add / Edit Form */}
//             <form onSubmit={editingProduct ? handleUpdate : handleAdd} className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-semibold mb-3">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
//                 <div className="grid grid-cols-3 gap-3">
//                     <input
//                         name="ItemId"
//                         value={form.ItemId}
//                         onChange={(e) => setForm({ ...form, ItemId: e.target.value })}
//                         className="border p-2 rounded"
//                         placeholder="Product ID"
//                         required
//                         disabled={editingProduct}
//                     />
//                     <input
//                         name="ProductName"
//                         value={form.ProductName}
//                         onChange={(e) => setForm({ ...form, ProductName: e.target.value })}
//                         className="border p-2 rounded"
//                         placeholder="Product Name"
//                         required
//                     />
//                     <input
//                         name="StockLevel"
//                         value={form.StockLevel}
//                         onChange={(e) => setForm({ ...form, StockLevel: e.target.value })}
//                         className="border p-2 rounded"
//                         placeholder="Stock Level"
//                         type="number"
//                         required
//                     />
//                 </div>
//                 <div className="mt-3 flex gap-2">
//                     <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                     >
//                         {editingProduct ? "Update Product" : "Add Product"}
//                     </button>
//                     {editingProduct && (
//                         <button
//                             type="button"
//                             onClick={cancelEdit}
//                             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                 </div>
//             </form>

//             {/* Product List */}
//             {loading ? (
//                 <p className="text-center text-gray-500">Loading products...</p>
//             ) : products.length === 0 ? (
//                 <p className="text-center text-gray-500">No products yet. Add your first product above!</p>
//             ) : (
//                 <table className="w-full border-collapse">
//                     <thead>
//                     <tr className="bg-gray-100 text-left">
//                         <th className="p-3 border">Product ID</th>
//                         <th className="p-3 border">Name</th>
//                         <th className="p-3 border">Stock Level</th>
//                         <th className="p-3 border">Actions</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {products.map((product) => (
//                         <tr key={product.ItemId} className="border-b hover:bg-gray-50">
//                             <td className="p-3 border">{product.ItemId}</td>
//                             <td className="p-3 border">{product.ProductName}</td>
//                             <td className="p-3 border">{product.StockLevel}</td>
//                             <td className="p-3 border">
//                                 <button
//                                     onClick={() => startEdit(product)}
//                                     className="bg-yellow-500 text-white px-3 py-1 text-sm rounded mr-2 hover:bg-yellow-600"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(product.ItemId)}
//                                     className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }


import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../service/api";

// ✅ Correct function export
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

  // ✅ Fetch products when shop changes
  useEffect(() => {
    if (!shop || !shop.shopId) return;
    loadProducts();
  }, [shop.shopId]);

  // ✅ Notify parent (Dashboard) whenever products update
  useEffect(() => {
    if (onProductsLoaded) {
      onProductsLoaded(products);
    }
  }, [products, onProductsLoaded]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(shop.shopId);
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        if (onProductsLoaded) onProductsLoaded(data.products); // notify dashboard
      } else {
        setProducts([]);
        setError("No products found or invalid response format.");
      }
    } catch (err) {
      setError("Error loading products: " + err.message);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
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
  };

  const handleUpdate = async (e) => {
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
  };

  const handleDelete = async (itemId) => {
    setError(null);
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(itemId, shop.shopId);
      loadProducts();
    } catch (err) {
      setError("Error deleting product: " + err.message);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm({
      ItemId: product.ItemId,
      ProductName: product.ProductName,
      StockLevel: product.StockLevel.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({ ItemId: "", ProductName: "", StockLevel: "" });
  };

  if (!shop) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
        ← Select a shop to manage products
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Products in {shop.shopName}
      </h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}

      {/* Add / Edit Form */}
      <form
        onSubmit={editingProduct ? handleUpdate : handleAdd}
        className="mb-6 p-4 bg-gray-50 rounded-lg"
      >
        <h3 className="font-semibold mb-3">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <input
            name="ItemId"
            value={form.ItemId}
            onChange={(e) => setForm({ ...form, ItemId: e.target.value })}
            className="border p-2 rounded"
            placeholder="Product ID"
            required
            disabled={editingProduct}
          />
          <input
            name="ProductName"
            value={form.ProductName}
            onChange={(e) => setForm({ ...form, ProductName: e.target.value })}
            className="border p-2 rounded"
            placeholder="Product Name"
            required
          />
          <input
            name="StockLevel"
            value={form.StockLevel}
            onChange={(e) => setForm({ ...form, StockLevel: e.target.value })}
            className="border p-2 rounded"
            placeholder="Stock Level"
            type="number"
            required
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products yet. Add your first product above!
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Product ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Stock Level</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.ItemId} className="border-b hover:bg-gray-50">
                <td className="p-3 border">{product.ItemId}</td>
                <td className="p-3 border">{product.ProductName}</td>
                <td className="p-3 border">{product.StockLevel}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => startEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 text-sm rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.ItemId)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

