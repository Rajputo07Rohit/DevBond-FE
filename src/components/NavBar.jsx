import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

// Premium Dark Glassmorphic Navbar matching the login UI
// Clean • Modern • Gradient Branding • Smooth UI

export default function NavBar() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {}
  };

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-xl">
      <div className="navbar max-w-7xl mx-auto px-4">
        {/* Left Brand */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-wide"
          >
            DevBond
          </Link>
        </div>

        {/* Right Section */}
        {user && (
          <div className="flex items-center gap-4">
            <p className="hidden md:block text-sm text-gray-300">
              Welcome, <span className="text-purple-400">{user.firstName}</span>
            </p>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:opacity-80 transition"
              >
                <div className="w-10 rounded-full ring-2 ring-purple-500/40">
                  <img alt="User" src={user.photoUrl} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg rounded-xl w-52 bg-neutral-900 border border-white/10"
              >
                <li>
                  <Link
                    to="/profile"
                    className="text-gray-200 hover:text-purple-400"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connection"
                    className="text-gray-200 hover:text-purple-400"
                  >
                    Connection
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
