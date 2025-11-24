import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/requestSlice";

// DevTinder — Connection Requests UI
// Premium Dark • Glassmorphic • Gradient Accents • Action Buttons

export default function Request() {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequest(res?.data?.data));
    } catch (err) {}
  };

  const reviewRequest = async (status, _id) => {
    console.log("clicl", status, _id);
    try {
      const res = await axios.post(
        BASE_URL + `/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        No Requests Found
      </div>
    );
  console.log(requests._id);
  console.log(requests);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Connection Requests 📩
        </h1>

        <div className="space-y-6">
          {requests.map((user) => (
            <div
              key={user?.fromUserId?._id}
              className="w-full p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl hover:border-pink-500/40 transition duration-300 flex items-center gap-5"
            >
              {/* Profile Photo */}
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-pink-500/30">
                <img
                  src={user?.fromUserId.photoUrl}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-gray-200">
                <h2 className="text-lg font-semibold">
                  {user?.fromUserId?.firstName} {user?.fromUserId?.lastName}
                </h2>
                {user.age && user.gender && (
                  <p className="text-sm opacity-70">
                    {user?.fromUserId?.age} • {user?.fromUserId?.gender}
                  </p>
                )}
                {user.about && (
                  <p className="text-sm opacity-60 mt-1 line-clamp-2">
                    {user?.fromUserId?.about}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[110px]">
                <button
                  className="btn rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90"
                  onClick={() => reviewRequest("accepted", user._id)}
                >
                  Accept
                </button>
                <button
                  className="btn rounded-xl bg-neutral-800 border border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:border-neutral-500"
                  onClick={() => reviewRequest("rejected", user._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
