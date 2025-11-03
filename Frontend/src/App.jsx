// // App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./Home";
// import InventoryDashboard from "./components/InventoryDashboard";
// import FruitDashboard from "./components/FruitDashboard";
// import DailyNeeds from "./components/DailyNeeds";
// import LoginPage from "./LoginPage";
// // function App() {
// //   return (
// //     <Router>
// //      <Routes>
// //   <Route path="/" element={<Home />} />
// //   <Route path="/shop/:shopId" element={<InventoryDashboard />} />
// //   <Route path="/shop/2" element={<FruitDashboard />} />
// //   <Route path="/shop/dailyneeds" element={<DailyNeeds />} />
// //   <Route path="/login" element={<LoginPage />} />

// // </Routes>

// //     </Router>
// //   );
// // }


// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route should redirect to login */}
//         <Route path="/" element={<Navigate to="/LoginPage" />} />

//         {/* Login page */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Home page */}
//         <Route path="/home" element={<Home />} />

//         {/* Shop pages */}
//         <Route path="/shop/1" element={<InventoryDashboard />} />
//         <Route path="/shop/2" element={<FruitDashboard />} />
//         <Route path="/shop/dailyneeds" element={<DailyNeeds />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import InventoryDashboard from "./components/InventoryDashboard";
import FruitDashboard from "./components/FruitDashboard";
import DailyNeeds from "./components/DailyNeeds";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/SignupPage" element={<SignupPage />} />
        {/* Login and Home */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />

        {/* Shop routes */}
        <Route path="/shop/1" element={<InventoryDashboard />} />
        <Route path="/shop/2" element={<FruitDashboard />} />
        <Route path="/shop/dailyneeds" element={<DailyNeeds />} />
      </Routes>
    </Router>
  );
}

export default App;
