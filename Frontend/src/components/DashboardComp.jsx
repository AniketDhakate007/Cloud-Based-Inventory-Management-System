import React, { useState } from "react";
import ShopList from "./ShopList";
import ProductManager from "./ProductManager";

const mockShops = [
    { shopId: "shop001", shopName: "Main Store" },
    { shopId: "shop002", shopName: "Branch Store" },
    { shopId: "shop003", shopName: "Online Store" },
];

export default function Dashboard({ user, signOut }) {
    const [shops] = useState(mockShops);
    const [selectedShop, setSelectedShop] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Inventory Manager</h1>
                        <p className="text-gray-600">Welcome, {user.signInDetails?.loginId || user.username}</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-6">
                    <ShopList
                        shops={shops}
                        selectedShop={selectedShop}
                        onSelect={setSelectedShop}
                    />
                    <div className="col-span-2">
                        <ProductManager shop={selectedShop} />
                    </div>
                </div>
            </div>
        </div>
    );
}
