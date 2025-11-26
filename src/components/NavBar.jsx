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
      <div className="navbar max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LEFT - LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          DevBond
        </Link>

        {/* RIGHT - PROFILE DROPDOWN */}
        {user && (
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

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-lg rounded-xl w-56
                         bg-neutral-900 border border-white/10 space-y-1"
            >
              <li>
                <Link to="/" className="text-gray-200 hover:text-purple-400">
                  Feed
                </Link>
              </li>

              <li>
                <Link
                  to="/connection"
                  className="text-gray-200 hover:text-purple-400"
                >
                  Connections
                </Link>
              </li>

              <li>
                <Link
                  to="/request"
                  className="text-gray-200 hover:text-purple-400"
                >
                  Requests
                </Link>
              </li>

              <div className="border-t border-white/10 my-2"></div>

              <li>
                <Link
                  to="/profile"
                  className="text-gray-200 hover:text-purple-400"
                >
                  Profile
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
        )}
      </div>
    </div>
  );
}
