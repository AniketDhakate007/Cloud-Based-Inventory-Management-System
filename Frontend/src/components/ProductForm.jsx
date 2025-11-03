import React, { useState } from "react";
import { addProduct } from "../service/api";

export default function ProductForm({ shop, onProductAdded }) {
    const [form, setForm] = useState({ productId: "", productName: "", stockLevel: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addProduct({ ...form, shopId: shop.shopId });
        setForm({ productId: "", productName: "", stockLevel: "" });
        onProductAdded(); // trigger reload
    };

    if (!shop) return null;

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
            <input name="productId" value={form.productId} onChange={handleChange}
                   className="border p-2" placeholder="Product ID" required />
            <input name="productName" value={form.productName} onChange={handleChange}
                   className="border p-2" placeholder="Product Name" required />
            <input name="stockLevel" value={form.stockLevel} onChange={handleChange}
                   className="border p-2" type="number" placeholder="Stock Level" required />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded">Add</button>
        </form>
    );
}
