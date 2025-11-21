import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

// Premium DevTinder Edit Profile Page
// Dark • Glassmorphic • Gradient Buttons • Live Preview

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-14 px-4">
      <div className="flex justify-center gap-10 flex-wrap max-w-6xl mx-auto">
        {/* FORM CARD */}
        <div className="w-96 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Edit Profile ✍️
          </h2>

          {/* FIRST NAME */}
          <label className="block mb-3 text-gray-300 text-sm">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input w-full rounded-xl bg-neutral-800 border-neutral-700 text-gray-200 mb-4"
          />

          {/* LAST NAME */}
          <label className="block mb-3 text-gray-300 text-sm">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input w-full rounded-xl bg-neutral-800 border-neutral-700 text-gray-200 mb-4"
          />

          {/* AGE */}
          <label className="block mb-3 text-gray-300 text-sm">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input w-full rounded-xl bg-neutral-800 border-neutral-700 text-gray-200 mb-4"
          />

          {/* GENDER */}
          <label className="block mb-3 text-gray-300 text-sm">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="select select-bordered w-full rounded-xl bg-neutral-800 border-neutral-700 text-gray-200 mb-4"
          >
            <option disabled value="">
              Select gender
            </option>
            <option value="male">Male ♂️</option>
            <option value="female">Female ♀️</option>
          </select>

          {/* PHOTO URL */}
          <label className="block mb-3 text-gray-300 text-sm">Photo URL</label>
          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="input w-full rounded-xl bg-neutral-800 border-neutral-700 text-gray-200 mb-4"
          />

          {/* ABOUT */}
          <label className="block mb-3 text-gray-300 text-sm">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="textarea w-full rounded-xl bg-neutral-800 border-neutral-700 text-gray-200 mb-4"
            placeholder="Write about yourself..."
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-2">{error}</p>
          )}

          {/* SAVE BUTTON */}
          <button
            onClick={saveProfile}
            className="btn w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:opacity-90"
          >
            Save Profile
          </button>
        </div>

        {/* LIVE PREVIEW */}
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="toast toast-top toast-center mt-14">
          <div className="alert alert-success rounded-xl bg-green-500 text-white shadow-lg">
            <span>Profile saved successfully ✔️</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
