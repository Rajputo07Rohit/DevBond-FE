import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

// Premium DevTinder Connections UI
// Dark • Glassmorphic • Gradient Accents • Clean Cards

export default function Connection() {
  const dispatch = useDispatch();
  const connection = useSelector((store) => store.connection);

  const fetchConnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnection(res?.data?.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  if (!connection) return null;

  if (connection.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        No Connections Found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Your Connections 🤝
        </h1>

        <div className="space-y-6">
          {connection.map((user) => (
            <div
              key={user._id}
              className="w-full p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl hover:border-purple-500/40 transition duration-300 flex items-center gap-5"
            >
              {/* Profile Photo */}
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-500/30">
                <img
                  src={user.photoUrl}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-gray-200">
                <h2 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                {user.age && user.gender && (
                  <p className="text-sm opacity-70">
                    {user.age} • {user.gender}
                  </p>
                )}
                {user.about && (
                  <p className="text-sm opacity-60 mt-1 line-clamp-2">
                    {user.about}
                  </p>
                )}
              </div>

              {/* Chat Button */}
              <button className="btn rounded-xl bg-linear-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90">
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
