import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

export default function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // ⭐ SHIMMER LOADING UI
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full p-4">
          <div className="rounded-2xl h-[430px] bg-white/5 border border-white/10 shimmer"></div>

          <div className="mt-4 h-10 bg-white/5 rounded-xl shimmer"></div>
        </div>
      </div>
    );

  // ⭐ NO RECOMMENDATION UI
  if (!feed || feed.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex flex-col items-center justify-center text-gray-400 text-lg">
        <p className="opacity-70">No more recommendations 👀</p>
        <p className="text-sm opacity-50 mt-2">Check back later</p>
      </div>
    );

  // ⭐ MAIN UI (ONE CARD)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full flex justify-center">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
}
