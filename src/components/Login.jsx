import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

// Premium Dark Login UI
// Modern • Glassmorphic • Centered • Beautiful simplicity

export default function Login() {
  const [emailId, setEmailId] = useState("hima@gmail.com");
  const [password, setPassword] = useState("Hima@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!emailId || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black p-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-sm">
        {/* Logo + Heading */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            DevBond
          </div>
          <p className="text-sm text-gray-400">
            Find developers. Build connections.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="Email"
            className="input w-full rounded-xl bg-neutral-800 text-neutral-content border-neutral-700 focus:border-purple-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input w-full rounded-xl bg-neutral-800 text-neutral-content border-neutral-700 focus:border-purple-500"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            className={`btn w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90 ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "" : "Login"}
          </button>
        </div>

        <p className="text-center text-sm mt-5 text-gray-400">
          Don't have an account?{" "}
          <button
            className="text-purple-400 hover:text-purple-300"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
