// import React from "react";
// import { Amplify } from "aws-amplify";
// import { Authenticator } from "@aws-amplify/ui-react";
// import '@aws-amplify/ui-react/styles.css';
// import Dashboard from "./components/DashboardComp.jsx";
// import awsExports from "./aws-exports";

// Amplify.configure(awsExports);

// const formFields = {
//     signUp: {
//         username: {
//             order: 1,
//             placeholder: 'Username',
//             label: 'Username',
//             isRequired: true,
//         },
//         name: {
//             order: 2,
//             placeholder: 'Enter your name',
//             label: 'Name',
//             isRequired: true,
//         },
//         email: {
//             order: 3,
//             placeholder: 'name@host.com',
//             label: 'Email',
//             isRequired: true,
//         },
//         password: {
//             order: 4,
//             placeholder: 'Password',
//             label: 'Password',
//             isRequired: true,
//         },
//         confirm_password: {
//             order: 5,
//             placeholder: 'Confirm Password',
//             label: 'Confirm Password',
//             isRequired: true,
//         },
//     },
// };

// function App() {
//     return (
//         <div className="min-h-screen bg-gray-100">
//             <Authenticator
//                 formFields={formFields}
//                 signUpAttributes={['email', 'name']}
//             >
//                 {({ signOut, user }) => (
//                     <Dashboard user={user} signOut={signOut} />
//                 )}
//             </Authenticator>
//         </div>
//     );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import Landing from "./pages/Landing.jsx";
import Dashboard from "./components/DashboardComp.jsx";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Username",
      label: "Username",
      isRequired: true,
    },
    name: {
      order: 2,
      placeholder: "Enter your name",
      label: "Name",
      isRequired: true,
    },
    email: {
      order: 3,
      placeholder: "name@host.com",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 4,
      placeholder: "Password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 5,
      placeholder: "Confirm Password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<Landing />} />

        {/* Login + Dashboard Route */}
        <Route
          path="/login"
          element={
            <Authenticator
              formFields={formFields}
              signUpAttributes={["email", "name"]}
            >
              {({ signOut, user }) => (
                <Dashboard user={user} signOut={signOut} />
              )}
            </Authenticator>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
