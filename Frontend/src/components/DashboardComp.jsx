// import React, { useState, useEffect } from "react";
// import { getCurrentUser, fetchAuthSession, signOut as amplifySignOut } from "aws-amplify/auth";
// import ProductManager from "./ProductManager";

// export default function Dashboard({ user, signOut }) {
//     const [shopId, setShopId] = useState(null);

//     useEffect(() => {
//         async function fetchShopId() {
//             try {
//                 const currentUser = await getCurrentUser();
//                 setShopId(currentUser.userId); // `userId` is equivalent to `attributes.sub`
//             } catch (error) {
//                 console.error("Error fetching user:", error);
//             }
//         }
//         fetchShopId();
//     }, []);

//     if (!shopId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p>Loading your shop...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="bg-white shadow p-4 flex justify-between items-center max-w-6xl mx-auto">
//                 <div>
//                     <h1 className="text-2xl font-bold">Inventory Manager</h1>
//                     <p className="text-gray-600">Welcome, {user?.username || "User"}</p>
//                 </div>
//                 <button
//                     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                     onClick={signOut || amplifySignOut}
//                 >
//                     Sign Out
//                 </button>
//             </header>

//             <main className="max-w-6xl mx-auto p-4">
//                 <h2 className="text-xl mb-4">Your Shop's Products</h2>
//                 <ProductManager shop={{ shopName: "Your Shop", shopId }} />
//             </main>
//         </div>
//     );
// }

// import React, { useState, useEffect } from "react";
// import { getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import ProductManager from "./ProductManager";

// export default function Dashboard({ user, signOut }) {
//   const [shopId, setShopId] = useState(null);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchShop() {
//       try {
//         const currentUser = await getCurrentUser();
//         setShopId(currentUser.userId);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     }
//     fetchShop();
//   }, []);

//   // ✅ Fetch product list for this shop
//   useEffect(() => {
//     if (!shopId) return;

//     async function fetchProducts() {
//       try {
//         const response = await axios.get(
//           `https://your-api-endpoint/products?shopId=${shopId}`
//         );
//         setProducts(response.data || []);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     }

//     fetchProducts();
//   }, [shopId]);

//   if (!shopId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading your shop...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow p-4 flex justify-between items-center max-w-6xl mx-auto">
//         <div>
//           <h1 className="text-2xl font-bold">Inventory Manager</h1>
//           <p className="text-gray-600">Welcome, {user?.username || "User"}</p>
//         </div>
//         <button
//           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//           onClick={signOut || amplifySignOut}
//         >
//           Sign Out
//         </button>
//       </header>

//       {/* Main */}
//       <main className="max-w-6xl mx-auto p-6">
//         <h2 className="text-xl font-semibold mb-4">📊 Stock Analysis</h2>

//         {/* ✅ Bar Chart directly from products */}
//         <div className="bg-white shadow-md rounded-lg p-4 mb-8">
//           {products.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={products}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="productName" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="stockLevel" fill="#4f46e5" name="Current Stock" />
//                 <Bar dataKey="threshold" fill="#22c55e" name="Threshold" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-center text-gray-500">
//               No products found for this shop.
//             </p>
//           )}
//         </div>

//         <h2 className="text-xl mb-4 font-semibold">🛍️ Manage Products</h2>
//         <ProductManager shop={{ shopName: "Your Shop", shopId }} />
//       </main>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  signOut as amplifySignOut,
} from "aws-amplify/auth";
import ProductManager from "./ProductManager";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard({ user, signOut }) {
  const [shopId, setShopId] = useState(null);
  const [products, setProducts] = useState([]);

  // ✅ Step 1: Get the current user's shopId
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setShopId(currentUser.userId);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  // ✅ Step 2: Receive products from ProductManager
  const handleProductsUpdate = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Section */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl mb-4 font-semibold">Stock Analysis</h2>

        {/* ✅ Stock Analysis Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
          {products.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ProductName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="StockLevel" fill="#8884d8" name="Current Stock" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center">No stock data available.</p>
          )}
        </div>

        {/* ✅ Product Manager */}
        <h2 className="text-xl mb-4">Your Shop’s Products</h2>
        <ProductManager
          shop={{ shopName: "Your Shop", shopId }}
          onProductsLoaded={handleProductsUpdate}
        />
      </main>
    </div>
  );
}

