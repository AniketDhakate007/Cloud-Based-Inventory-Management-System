import React from "react";

export default function ShopList({ shops, selectedShop, onSelect }) {
    return (
        <div className="w-1/3 p-4">
            <h2 className="text-xl font-semibold mb-2">Shops</h2>
            <ul>
                {shops.map(shop => (
                    <li
                        key={shop.shopId}
                        className={`cursor-pointer p-2 rounded mb-2 ${selectedShop && selectedShop.shopId === shop.shopId ? 'bg-blue-200' : 'bg-white'} hover:bg-blue-100`}
                        onClick={() => onSelect(shop)}
                    >
                        {shop.shopName}
                    </li>
                ))}
            </ul>
        </div>
    );
}
