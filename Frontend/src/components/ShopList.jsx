import React from "react";

export default function ShopList({ shops, selectedShop, onSelect }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">My Shops</h2>
            <ul className="space-y-2">
                {shops.map(shop => (
                    <li
                        key={shop.shopId}
                        className={`cursor-pointer p-3 rounded-lg transition ${
                            selectedShop?.shopId === shop.shopId
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => onSelect(shop)}
                    >
                        <div className="font-medium">{shop.shopName}</div>
                        <div className={`text-sm ${selectedShop?.shopId === shop.shopId ? 'text-blue-100' : 'text-gray-500'}`}>
                            {shop.shopId}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
