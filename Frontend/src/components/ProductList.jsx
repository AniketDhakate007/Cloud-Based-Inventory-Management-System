import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../service/api";

export default function ProductList({ shop, refreshTrigger }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!shop) return;
        getProducts(shop.shopId).then(data => setProducts(data));
    }, [shop, refreshTrigger]);

    const handleDelete = async (productId) => {
        await deleteProduct(productId, shop.shopId);
        getProducts(shop.shopId).then(data => setProducts(data)); // reload
    };

    if (!shop) return <div className="w-2/3 p-4">Select a shop to view products.</div>;

    return (
        <div className="w-2/3 p-4">
            <h2 className="text-xl font-semibold mb-2">Products in "{shop.shopName}"</h2>
            <table className="w-full">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Stock</th><th className="p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.ItemId} className="border-b hover:bg-gray-50">
                        <td className="p-3 border">{product.ItemId}</td>
                        <td className="p-3 border">{product.ProductName}</td>
                        <td className="p-3 border">{product.StockLevel}</td>
                        <td className="p-3">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded mr-2">Edit</button>
                            <button onClick={() => handleDelete(p.productId)} className="bg-red-500 text-white px-2 py-1 text-xs rounded">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
