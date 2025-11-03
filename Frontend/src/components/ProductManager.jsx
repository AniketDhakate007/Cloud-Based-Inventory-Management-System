import React, { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../service/api";

export default function ProductManager({ shop }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ productId: "", productName: "", stockLevel: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shop) return;
        loadProducts();
    }, [shop]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts(shop.shopId);
            if (Array.isArray(data.products)) {
                setProducts(data.products);
            } else {
                setProducts([]);
                setError("Invalid products data");
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
            await addProduct({ ...form, shopId: shop.shopId });
            setForm({ productId: "", productName: "", stockLevel: "" });
            loadProducts();
        } catch (err) {
            setError("Error adding product: " + err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await updateProduct(editingProduct.productId, shop.shopId, {
                productName: form.productName,
                stockLevel: form.stockLevel,
            });
            setEditingProduct(null);
            setForm({ productId: "", productName: "", stockLevel: "" });
            loadProducts();
        } catch (err) {
            setError("Error updating product: " + err.message);
        }
    };

    const handleDelete = async (productId) => {
        setError(null);
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            await deleteProduct(productId, shop.shopId);
            loadProducts();
        } catch (err) {
            setError("Error deleting product: " + err.message);
        }
    };

    const startEdit = (product) => {
        setEditingProduct(product);
        setForm({
            productId: product.productId,
            productName: product.productName,
            stockLevel: product.stockLevel.toString(),
        });
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setForm({ productId: "", productName: "", stockLevel: "" });
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
            <h2 className="text-xl font-semibold mb-4">Products in {shop.shopName}</h2>
            {error && <p className="text-red-600 mb-3">{error}</p>}

            {/* Add / Edit Form */}
            <form onSubmit={editingProduct ? handleUpdate : handleAdd} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <div className="grid grid-cols-3 gap-3">
                    <input
                        name="productId"
                        value={form.productId}
                        onChange={(e) => setForm({ ...form, productId: e.target.value })}
                        className="border p-2 rounded"
                        placeholder="Product ID"
                        required
                        disabled={editingProduct}
                    />
                    <input
                        name="productName"
                        value={form.productName}
                        onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        className="border p-2 rounded"
                        placeholder="Product Name"
                        required
                    />
                    <input
                        name="stockLevel"
                        value={form.stockLevel}
                        onChange={(e) => setForm({ ...form, stockLevel: e.target.value })}
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
                <p className="text-center text-gray-500">No products yet. Add your first product above!</p>
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
                        <tr key={product.productId} className="border-b hover:bg-gray-50">
                            <td className="p-3 border">{product.productId}</td>
                            <td className="p-3 border">{product.productName}</td>
                            <td className="p-3 border">{product.stockLevel}</td>
                            <td className="p-3 border">
                                <button
                                    onClick={() => startEdit(product)}
                                    className="bg-yellow-500 text-white px-3 py-1 text-sm rounded mr-2 hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.productId)}
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
