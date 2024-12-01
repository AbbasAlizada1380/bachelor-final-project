// src/components/DeleteUser.jsx

import React, { useState } from "react";
import axios from "axios";

const DeleteUser = ({ id }) => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = async () => {
    try {
      const adminZone = await axios.get(`http://localhost:8038/users/${id}`);
      const userZone = await axios.get(`http://localhost:8038/users/${userId}`);
      if(adminZone.data.zone != userZone.data.zone){
        setMessage("کاربر مربوط زون دیگری است")
        setError("");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      } else if (adminZone.data.zone === userZone.data.zone) {
        await axios.delete(`http://localhost:8038/users/${userId}`);
        setMessage("حساب کاربر با موفقیت حذف شد");
        setError("");
        setUserId('')
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
    } catch (err) {
      setError("خطا در حذف حساب کاربر");
      setMessage("");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-950 p-4">
      <div className="w-full max-w-md bg-red-700 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-white mb-4">حذف حساب کاربر</h2>
        <label className="text-white" htmlFor="number">
          id کاربر
        </label>{" "}
        <br />
        <input
          name="number"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mb-4 p-2 border w-full rounded"
        />{" "}
        <br />
        <button
          onClick={handleDelete}
          className="bg-white text-black hover:bg-black hover:text-white font-bold py-2 px-4 rounded"
        >
          حذف
        </button>
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}

          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
