import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    // FIX: only skip if feed already loaded
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data.data)); // correct
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []); // FIX: run only once

  return (
    <>
      {feed &&
        feed.length > 0 &&
        feed.map((item) => (
          <div key={item._id} className="flex justify-center my-10">
            <UserCard user={item} />
          </div>
        ))}
    </>
  );
}

export default Feed;
