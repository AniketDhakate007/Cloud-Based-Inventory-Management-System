import React, { useState, useEffect } from "react";
import { getCurrentUser, fetchAuthSession, signOut as amplifySignOut } from "aws-amplify/auth";
import ProductManager from "./ProductManager";

export default function Dashboard({ user, signOut }) {
    const [shopId, setShopId] = useState(null);

    useEffect(() => {
        async function fetchShopId() {
            try {
                const currentUser = await getCurrentUser();
                setShopId(currentUser.userId); // `userId` is equivalent to `attributes.sub`
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchShopId();
    }, []);

    if (!shopId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading your shop...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow p-4 flex justify-between items-center max-w-6xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold">Inventory Manager</h1>
                    <p className="text-gray-600">Welcome, {user?.username || "User"}</p>
                </div>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={signOut || amplifySignOut}
                >
                    Sign Out
                </button>
            </header>

            <main className="max-w-6xl mx-auto p-4">
                <h2 className="text-xl mb-4">Your Shop's Products</h2>
                <ProductManager shop={{ shopName: "Your Shop", shopId }} />
            </main>
        </div>
    );
}
