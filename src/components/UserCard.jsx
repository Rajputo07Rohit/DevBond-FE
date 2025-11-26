import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import axios from "axios";
import { removeUserFeed } from "../utils/feedSlice";

// Premium DevTinder User Card
// Glassmorphic • Gradient Border • Modern Buttons • Clean Layout

export default function UserCard({ user, profile }) {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeUserFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-96 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition duration-300">
      {/* User Image */}
      <div className="relative h-72 w-full overflow-hidden group">
        <img
          src={photoUrl}
          alt="User"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4 text-white">
          <h2 className="text-2xl font-bold drop-shadow-md">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-sm opacity-90 drop-shadow-md">
              {age} • {gender}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 text-gray-200">
        <p className="text-sm opacity-80 mb-4 line-clamp-3">{about}</p>

        {/* Buttons */}

        {!profile && (
          <div className="flex items-center justify-between mt-4">
            <button
              className="btn w-1/2 mr-2 rounded-xl bg-neutral-800 border border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:border-neutral-500"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>

            <button
              className="btn w-1/2 ml-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
