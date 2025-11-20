import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [emailId, setEmailId] = useState("hima@gmail.com");
  const [password, setPassword] = useState("Hima@123");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" flex justify-center my-10 ">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-base-content">
            Welcome Back 👋
          </h2>
          <h2 className="card-title justify-center">Login!</h2>
          <div>
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="text"
                value={emailId}
                className="input rounded-md"
                placeholder="Type here"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset ">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="text"
                value={password}
                className="input rounded-md"
                placeholder="Type here"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary my-2 rounded-xl"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
