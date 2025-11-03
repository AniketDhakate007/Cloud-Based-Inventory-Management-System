import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleLogin = () => {
    // call parent or perform authentication
    if (onLogin) {
      onLogin(email, password);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581091215367-59ab6cda13f0?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Box */}
      <div className="relative z-10 bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Welcome Back 👋</h2>

        {/* Email */}
        <div className="mb-4 text-left">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <Mail className="text-gray-500 mr-2" size={18} />
            <input
              type="email"
              className="w-full outline-none bg-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6 text-left">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <Lock className="text-gray-500 mr-2" size={18} />
            <input
              type="password"
              className="w-full outline-none bg-transparent"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="mt-6 text-gray-700">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/SignupPage")} // ✅ use navigate instead of <a href>
            className="text-blue-600 hover:underline font-semibold bg-transparent border-none"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
