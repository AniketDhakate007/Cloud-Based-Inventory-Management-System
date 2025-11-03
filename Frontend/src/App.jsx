
import React from "react";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import Dashboard from "./components/DashboardComp.jsx";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import InventoryDashboard from "./components/InventoryDashboard";
import FruitDashboard from "./components/FruitDashboard";
import DailyNeeds from "./components/DailyNeeds";

  Amplify.configure(awsExports);


// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Redirect root to login */}
//         <Route path="/" element={<Navigate to="/home" replace />} />
//         <Route path="/SignupPage" element={<SignupPage />} />
//         {/* Login and Home */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/home" element={<Home />} />
//
//         {/* Shop routes */}
//         <Route path="/shop/1" element={<InventoryDashboard />} />
//         <Route path="/shop/2" element={<FruitDashboard />} />
//         <Route path="/shop/dailyneeds" element={<DailyNeeds />} />
//       </Routes>
//     </Router>
//   );
// }
//
// export default App;

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Authenticator>
          {({ signOut, user }) => (
              <Dashboard user={user} signOut={signOut} />
          )}
        </Authenticator>
      </div>
  );
}

export default App;
