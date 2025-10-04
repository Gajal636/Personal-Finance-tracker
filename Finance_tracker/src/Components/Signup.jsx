import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

// ✅ Use environment variable
const BASE_API = import.meta.env.VITE_BASE_API;

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post(`${BASE_API}/user/signup`, {
        username: form.username,
        email: form.email,
        password: form.password,
        confirm: form.confirm, // backend expects "confirm"
      });

      alert(res.data.message || "Account created successfully!");
      setForm({ username: "", email: "", password: "", confirm: "" });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed, try again.");
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google user info:", credentialResponse);
    alert("Signed up with Google!");
    navigate("/login"); 
  };

  const handleGoogleError = () => {
    alert("Google signup failed. Try again.");
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Image or gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 justify-center items-center">
        <h1 className="text-white text-5xl font-bold p-8">Create Your Account!</h1>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-900">
        <div className="w-full max-w-md p-10 rounded-3xl bg-black/70 backdrop-blur-lg shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">
            Sign Up
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Enter your details or continue with Google
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              required
            />
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
            >
              Sign Up
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
            Already have an account?{" "}
            <span
              className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
