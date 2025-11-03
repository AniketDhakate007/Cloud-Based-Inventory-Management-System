import React, { useState } from "react";
import {
    LayoutDashboard,
    Package,
    LogOut,
    Menu,
    X,
    User,
    Bell,
    Search,
    Plus,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import ShopList from "./ShopList";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

const mockShops = [
    { shopId: "s1", shopName: "Main Store" },
    { shopId: "s2", shopName: "Branch Store" },
];

export default function Dashboard({ user, signOut }) {
    const [shops] = useState(mockShops);
    const [selectedShop, setSelectedShop] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);

    const handleProductAdded = () => {
        setRefreshTrigger(x => x + 1);
        setShowProductForm(false);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
                    ${sidebarOpen ? 'w-72' : 'w-0 md:w-20'} 
                    bg-white border-r border-slate-200 
                    transition-all duration-300 ease-in-out 
                    flex flex-col shadow-xl
                    relative z-20
                `}
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                <Package className="text-white" size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">InvenTrack</h2>
                                <p className="text-xs text-slate-500">Pro Dashboard</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Shop List */}
                {sidebarOpen && (
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                                Your Locations
                            </h3>
                            <ShopList
                                shops={shops}
                                selectedShop={selectedShop}
                                onSelect={setSelectedShop}
                            />
                        </div>

                        {/* Quick Stats */}
                        {selectedShop && (
                            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <h4 className="text-xs font-semibold text-slate-600 mb-3">Quick Stats</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Total Products</span>
                                        <span className="text-sm font-bold text-slate-800">--</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Low Stock</span>
                                        <span className="text-sm font-bold text-amber-600">--</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Sidebar Footer */}
                {sidebarOpen && (
                    <div className="p-4 border-t border-slate-200">
                        <button
                            onClick={signOut}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200 font-medium group"
                        >
                            <LogOut size={18} className="group-hover:translate-x-[-2px] transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <Menu size={22} />
                            </button>

                            <div className="flex-1 max-w-xl">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search products, categories..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                            <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                                <Bell size={20} className="text-slate-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-semibold text-slate-800">{user?.email || 'User'}</p>
                                    <p className="text-xs text-slate-500">Administrator</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <User size={20} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!selectedShop ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <LayoutDashboard size={36} className="text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Select a Location</h3>
                                <p className="text-slate-500">Choose a shop from the sidebar to view and manage its inventory</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Header with Action Button */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                        <Package size={32} className="text-blue-600" />
                                        {selectedShop.shopName}
                                    </h1>
                                    <p className="text-slate-500 mt-1">Manage your inventory and track stock levels</p>
                                </div>
                                <button
                                    onClick={() => setShowProductForm(!showProductForm)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <Plus size={20} />
                                    Add Product
                                </button>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Total Value</p>
                                            <p className="text-2xl font-bold text-slate-800 mt-1">₹--</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <TrendingUp size={24} className="text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Total Items</p>
                                            <p className="text-2xl font-bold text-slate-800 mt-1">--</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Package size={24} className="text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Low Stock Alert</p>
                                            <p className="text-2xl font-bold text-slate-800 mt-1">--</p>
                                        </div>
                                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <AlertCircle size={24} className="text-amber-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Form Modal */}
                            {showProductForm && (
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-800">Add New Product</h3>
                                        <button
                                            onClick={() => setShowProductForm(false)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <ProductForm
                                        shop={selectedShop}
                                        onProductAdded={handleProductAdded}
                                    />
                                </div>
                            )}

                            {/* Product List */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <h3 className="text-xl font-bold text-slate-800">Product Inventory</h3>
                                    <p className="text-sm text-slate-500 mt-1">View and manage all products in this location</p>
                                </div>
                                <ProductList
                                    shop={selectedShop}
                                    refreshTrigger={refreshTrigger}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
