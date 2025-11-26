import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

export default function LoginSignup() {
  const [mode, setMode] = useState("login"); // login | signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!emailId || !password) return setError("All fields are required.");

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
      setError(err?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError("");
    if (!firstName || !lastName || !emailId || !password)
      return setError("All fields are required.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black p-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-sm">
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            DevBond
          </div>
          <p className="text-sm text-gray-400">
            {mode === "login"
              ? "Welcome back! Login to continue."
              : "Create your account to get started."}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Signup Extra Fields */}
          {mode === "signup" && (
            <>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="input w-full rounded-xl bg-neutral-800 text-neutral-content border-neutral-700 focus:border-purple-500"
              />

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="input w-full rounded-xl bg-neutral-800 text-neutral-content border-neutral-700 focus:border-purple-500"
              />
            </>
          )}

          {/* Always visible */}
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

          {/* Button */}
          <button
            onClick={mode === "login" ? handleLogin : handleSignup}
            className={`btn w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90 ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "" : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </div>

        {/* Switch Mode */}
        <p className="text-center text-sm mt-5 text-gray-400">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            className="text-purple-400 hover:text-purple-300 ml-1"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
