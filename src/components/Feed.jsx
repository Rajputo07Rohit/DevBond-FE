import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

// Premium Feed UI (Matches the glassmorphic DevTinder theme)
// Centered • Soft gradient shadows • Smooth spacing

export default function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        {feed && feed.length > 0 ? (
          feed.map((user) => (
            <div
              key={user._id}
              className="flex justify-center w-full animate-fadeIn"
            >
              <UserCard user={user} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 text-lg pt-20 opacity-70">
            Loading recommendations...
          </div>
        )}
      </div>
    </div>
  );
}
