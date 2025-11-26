import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

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
      <div className="navbar max-w-7xl mx-auto px-6">
        {/* LEFT - LOGO */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            DevBond
          </Link>
        </div>

        {/* MIDDLE - NAV LINKS */}
        {user && (
          <div className="hidden md:flex gap-8 mr-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-400 font-medium transition"
            >
              Feed
            </Link>

            <Link
              to="/connection"
              className="text-gray-300 hover:text-purple-400 font-medium transition"
            >
              Connections
            </Link>

            <Link
              to="/request"
              className="text-gray-300 hover:text-purple-400 font-medium transition"
            >
              Requests
            </Link>
          </div>
        )}

        {/* RIGHT - PROFILE DROPDOWN */}
        {user && (
          <div className="flex items-center gap-4">
            <p className="hidden md:block text-sm text-gray-300">
              Hi, <span className="text-purple-400">{user.firstName}</span>
            </p>

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
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg rounded-xl w-56 bg-neutral-900 border border-white/10"
              >
                <li>
                  <Link
                    className="text-gray-200 hover:text-purple-400"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-200 hover:text-purple-400"
                    to="/settings"
                  >
                    Settings
                  </Link>
                </li>

                <li>
                  <a
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
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
