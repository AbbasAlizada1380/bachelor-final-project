import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUser = ({ id }) => {
  const [form, setForm] = useState({
    name: "",
    userName: "",
    Password: "",
    confirmPassword: "",
    email: "",
    role: "",
    zone: "",
    mode: "active",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const { name, userName, Password, confirmPassword, email, role } = form;

    if (!name.trim()) newErrors.name = "نام ضروری است";
    if (!userName.trim()) newErrors.userName = "نام کاربری ضروری است";
    if (Password.length < 6) newErrors.Password = "رمز عبور باید حداقل ۶ حرف باشد";
    if (Password !== confirmPassword) newErrors.confirmPassword = "رمز عبور مطابقت ندارد";
    if (!email.trim()) newErrors.email = "ایمیل ضروری است";
    if (role !== "کاربر") newErrors.role = "نقش باید کاربر باشد";

    return newErrors;
  };

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const res = await axios.get(`http://localhost:8038/users/${id}`);
        const { zone } = res.data;
        setForm((prevForm) => ({ ...prevForm, zone }));
      } catch (error) {
        console.error("Error fetching zone:", error);
      }
    };

    fetchZone();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...formData } = form; // Exclude confirmPassword
      const response = await axios.post("http://localhost:8038/users/createUser", formData);
      setMessage("اطلاعات موفقانه ثبت گردید");
      setForm({
        name: "",
        userName: "",
        Password: "",
        confirmPassword: "",
        email: "",
        role: "",
        zone: form.zone, // Maintain zone value after form reset
        mode: "active",
      });
      setErrors({});
      setTimeout(() => {
        setMessage("");
      }, 5000); // Clear message after 5 seconds
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes("Username already exists")) {
        setMessage("نام کاربری تکراری است");
      } else {
        setMessage("خطا در ارسال اطلاعات");
      }
      setTimeout(() => {
        setMessage("");
      }, 5000); // Clear message after 5 seconds
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-950 p-4">
      <form
        className="w-full max-w-md bg-red-700 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 text-center text-white">افزودن کاربر جدید</h2>

        <div className="grid grid-cols-1 gap-4">
          {["name", "userName", "Password", "confirmPassword", "email", "role"].map((field) => (
            <div key={field}>
              <label
                className="block text-sm font-bold mb-2 text-white"
                htmlFor={field}
              >
                {field === "name" && "نام"}
                {field === "userName" && "نام کاربری"}
                {field === "Password" && "رمز عبور"}
                {field === "confirmPassword" && "تأیید رمز عبور"}
                {field === "email" && "ایمیل"}
                {field === "role" && "نقش"}
              </label>
              {field === "role" ? (
                <select
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">انتخاب نقش</option>
                  <option value="کاربر">کاربر</option>
                </select>
              ) : (
                <input
                  id={field}
                  name={field}
                  type={field === "Password" || field === "confirmPassword" ? "Password" : "text"}
                  value={form[field]}
                  onChange={handleChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors[field] ? "border-red-500" : ""
                  }`}
                />
              )}
              {errors[field] && (
                <p className="text-black text-xs italic">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-white text-green-950 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            افزودن کاربر
          </button>
        </div>
      </form>
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`py-2 px-4 rounded ${
              message.includes("موفق")
                ? "bg-white text-green-600"
                : "bg-white  text-red-600"
            }`}
          >
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
