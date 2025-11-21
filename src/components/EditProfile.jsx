import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

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
    <>
      <div className="flex justify-center my-10 gap-8 flex-wrap">
        {/* Form Card */}
        <div className="card bg-base-300 w-96 shadow-sm">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center">Edit Profile ✍️</h2>

            {/* FIRST NAME */}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">First Name</legend>
              <input
                type="text"
                value={firstName}
                className="input rounded-md"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </fieldset>

            {/* LAST NAME */}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Last Name</legend>
              <input
                type="text"
                value={lastName}
                className="input rounded-md"
                onChange={(e) => setLastName(e.target.value)}
              />
            </fieldset>

            {/* AGE */}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Age</legend>
              <input
                type="number"
                value={age}
                className="input rounded-md"
                onChange={(e) => setAge(e.target.value)}
              />
            </fieldset>

            {/* GENDER DROPDOWN */}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Gender</legend>
              <select
                value={gender}
                className="select select-bordered rounded-md"
                onChange={(e) => setGender(e.target.value)}
              >
                <option disabled value="">
                  Select gender
                </option>
                <option value="Male">male ♂️</option>
                <option value="Female">female ♀️</option>
              </select>
            </fieldset>

            {/* PHOTO URL */}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Photo URL</legend>
              <input
                type="text"
                value={photoUrl}
                className="input rounded-md"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </fieldset>

            {/* ABOUT - TEXTAREA */}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">About</legend>
              <textarea
                value={about}
                rows={4}
                className="textarea textarea-bordered rounded-md"
                placeholder="Write about yourself..."
                onChange={(e) => setAbout(e.target.value)}
              />
            </fieldset>

            {/* Error message */}
            <p className="text-red-600 text-sm text-center">{error}</p>

            {/* Save Button */}
            <div className="card-actions justify-center">
              <button
                className="btn btn-primary rounded-xl"
                onClick={saveProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Live Profile Preview */}
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>

      {/* Toast message */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
