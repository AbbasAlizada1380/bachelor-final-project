import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateAppointment = ({ id }) => {
  const [form, setForm] = useState({ amount: "", zone: "" });
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8038/users/${id}`);
        const { name, username, email, image, password,zone } = res.data;

        setForm((prevForm) => ({ ...prevForm, zone }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { amount } = form;

    if (!amount || isNaN(amount) || amount <= 0) {
      setMessageType("error");
      setMessage("لطفاً مقدار صحیح را وارد کنید");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
      return;
    }

    try {console.log(form);
      const response = await axios.post("http://localhost:8038/appointment/update", form);
      setMessageType("success");
      setMessage(response.data.message || "قرارها با موفقیت به‌روزرسانی شدند");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } catch (error) {
      console.error("Error updating appointments:", error);
      setMessageType("error");
      setMessage("هنگام به‌روزرسانی قرارها خطایی رخ داد");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-950 p-4 relative">
      <div className="bg-red-600 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          به‌روزرسانی قرارها
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">
              مقدار رکوردها برای به‌ روز رسانی:
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            به‌روزرسانی
          </button>
        </form>
      </div>
      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg bg-white ${
              messageType === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAppointment;
