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
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black min-h-screen">
        {/* Abstract Background Elements - Positioned away from center */}
        <div className="fixed inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-700 rounded-full blur-3xl"></div>
        </div>

        {/* Router Content */}
        <div className="relative z-10">
          <Router>
            <Routes>
              {/* Landing Page Route */}
              <Route path="/" element={<Landing />} />

              {/* Login + Dashboard Route */}
              <Route
                  path="/login"
                  element={
                    <div className="min-h-screen flex items-center justify-center px-4 py-8">
                      <style>{`
                    /* Authenticator Custom Styling */
                    [data-amplify-authenticator] {
                      --amplify-colors-background-primary: transparent;
                      --amplify-colors-background-secondary: rgba(20, 28, 45, 0.95);
                      --amplify-colors-text-primary: rgb(255, 255, 255);
                      --amplify-colors-text-secondary: rgb(200, 205, 220);
                      --amplify-colors-border-primary: rgba(239, 68, 68, 0.4);
                      --amplify-colors-border-secondary: rgba(139, 92, 246, 0.2);
                    }

                    /* Input Styling */
                    [data-amplify-authenticator] input,
                    [data-amplify-authenticator] input::placeholder {
                      background-color: rgba(30, 41, 59, 0.9) !important;
                      border: 1px solid rgba(239, 68, 68, 0.4) !important;
                      color: rgb(229, 231, 235) !important;
                      font-size: 14px !important;
                      padding: 10px 12px !important;
                    }

                    [data-amplify-authenticator] input::placeholder {
                      color: rgb(120, 125, 140) !important;
                    }

                    [data-amplify-authenticator] input:focus {
                      border-color: rgb(239, 68, 68) !important;
                      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
                      outline: none !important;
                    }

                    /* Button Styling */
                    [data-amplify-authenticator] button[type="submit"] {
                      background-color: rgb(239, 68, 68) !important;
                      border-color: rgb(239, 68, 68) !important;
                      color: white !important;
                      font-weight: 700 !important;
                      border-radius: 0.5rem !important;
                      transition: all 0.3s !important;
                      padding: 12px 16px !important;
                      font-size: 15px !important;
                    }

                    [data-amplify-authenticator] button[type="submit"]:hover {
                      background-color: rgb(220, 38, 38) !important;
                      box-shadow: 0 0 25px rgba(239, 68, 68, 0.5) !important;
                      transform: translateY(-2px);
                    }

                    /* Tab Styling */
                    [data-amplify-authenticator] [role="tab"] {
                      color: rgb(160, 170, 185) !important;
                      border-bottom: 2px solid transparent !important;
                      padding-bottom: 10px !important;
                      font-weight: 600 !important;
                    }

                    [data-amplify-authenticator] [role="tab"][aria-selected="true"] {
                      color: rgb(239, 68, 68) !important;
                      border-bottom: 2px solid rgb(239, 68, 68) !important;
                    }

                    /* Label Styling */
                    [data-amplify-authenticator] label {
                      color: rgb(209, 213, 219) !important;
                      font-weight: 600 !important;
                      font-size: 14px !important;
                      margin-bottom: 8px !important;
                    }

                    /* Main Container */
                    [data-amplify-authenticator] > div {
                      background-color: rgba(20, 28, 45, 0.92) !important;
                      backdrop-filter: blur(12px) !important;
                      border-radius: 12px !important;
                      border: 1px solid rgba(239, 68, 68, 0.25) !important;
                      padding: 40px 32px !important;
                      max-width: 450px !important;
                      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
                    }

                    /* Link Styling */
                    [data-amplify-authenticator] a {
                      color: rgb(239, 68, 68) !important;
                      font-weight: 500 !important;
                    }

                    [data-amplify-authenticator] a:hover {
                      color: rgb(220, 38, 38) !important;
                    }

                    /* Text and Headers */
                    [data-amplify-authenticator] h1,
                    [data-amplify-authenticator] h2 {
                      color: rgb(255, 255, 255) !important;
                      font-weight: 700 !important;
                    }

                    /* Remove default shadows */
                    [data-amplify-authenticator] * {
                      box-shadow: none !important;
                    }

                    /* Fieldset */
                    [data-amplify-authenticator] fieldset {
                      border-color: rgba(239, 68, 68, 0.15) !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                  `}</style>
                      <Authenticator
                          formFields={formFields}
                          signUpAttributes={["email", "name"]}
                      >
                        {({ signOut, user }) => (
                            <Dashboard user={user} signOut={signOut} />
                        )}
                      </Authenticator>
                    </div>
                  }
              />
            </Routes>
          </Router>
        </div>
      </div>
  );
}

export default App;
