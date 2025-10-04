import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

// ✅ Use environment variable
const BASE_API = import.meta.env.VITE_BASE_API;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_API}/user/login`, form);
      console.log("✅ Login successful", res.data.user);

      setMessage("Login successful!");
      navigate("/financeTracker");
    } catch (err) {
      console.log("❌ " + (err.response?.data?.message || "Login failed"));
      setMessage("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google user info:", credentialResponse);
    alert("Logged in with Google!");
    navigate("/financeTracker"); // redirect after login
  };

  const handleGoogleError = () => {
    alert("Google login failed. Try again.");
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Image or gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 justify-center items-center">
        <h1 className="text-white text-5xl font-bold p-8">Welcome Back!</h1>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-900">
        <div className="w-full max-w-md p-10 rounded-3xl bg-black/70 backdrop-blur-lg shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">
            Login to your account
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Enter your credentials or use Google to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
            >
              Login
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              onClick={() => navigate("/")}
            >
              Sign up
            </span>
          </p>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
