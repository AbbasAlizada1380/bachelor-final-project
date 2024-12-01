import React, { useState } from "react";
import axios from "axios";

const RegisterWitness = ({ id }) => {
  const [formData, setFormData] = useState({
    Name: "",
    lastName: "",
    fatherName: "",
    GfatherName: "",
    gender: "",
    birthDate: "",
    birthPlace: "",
    residency: "",
    nation: "",
    religion: "",
    NIC: "",
    coupleId: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.Name) newErrors.Name = "نام ضروری است";
    if (!formData.lastName) newErrors.lastName = "تخلص ضروری است";
    if (!formData.fatherName) newErrors.fatherName = "نام پدر ضروری است";
    if (!formData.GfatherName) newErrors.GfatherName = "نام پدرکلان ضروری است";
    if (
      !formData.gender ||
      (formData.gender !== "مرد" && formData.gender !== "زن")
    )
      newErrors.gender = "جنسیت باید مرد یا زن باشد";
    if (!formData.birthDate) newErrors.birthDate = "تاریخ تولد ضروری است";
    else if (formData.birthDate > today)
      newErrors.birthDate = "تاریخ تولد نمی‌تواند بعد از امروز باشد";
    if (!formData.birthPlace) newErrors.birthPlace = "محل تولد ضروری است";
    if (!formData.residency) newErrors.residency = "محل سکونت ضروری است";
    if (!formData.nation) newErrors.nation = "قوم ضروری است";
    if (!formData.religion) newErrors.religion = "دین ضروری است";
    if (!formData.NIC || !/^[\d-_]+$/.test(formData.NIC))
      newErrors.NIC = "NIC فقط می‌تواند شامل اعداد، خط فاصله و زیرخط باشد";
    if (!formData.coupleId || !/^\d+$/.test(formData.coupleId))
      newErrors.coupleId = "شماره خانواده  باید فقط شامل اعداد باشد";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const userZone = await axios.get(`http://localhost:8038/users/${id}`);
      const coupleId = formData.coupleId;
      const coupleZone = await axios.get(`http://localhost:8038/appointment/${coupleId}`);

      if (userZone.data.zone === coupleZone.data.zone) {
        await axios.post("http://localhost:8038/records/witness", formData);
        setMessage("ریکارد با موفقیت ثبت شد");
        setFormData({
          Name: "",
          lastName: "",
          fatherName: "",
          GfatherName: "",
          gender: "",
          birthDate: "",
          birthPlace: "",
          residency: "",
          nation: "",
          religion: "",
          NIC: "",
          coupleId: "",
        });
        setErrors({});
      } else {
        setMessage("شما مجاز به ثبت شاهد نمی‌باشید");
      }

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 5000);
    } catch (error) {
      setMessage("خطا در ثبت ریکارد");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-950 p-4 relative">
      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`bg-${
              message.includes("موفقیت") ? "green" : "red"
            }-500 text-white py-2 px-4 rounded shadow-lg`}
          >
            <span>{message}</span>
          </div>
        </div>
      )}
      <form
        className="w-full max-w-md bg-red-600 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 text-center text-white">ثبت شاهد</h2>
        {Object.keys(formData).map((field) => (
          <div className="mb-4" key={field}>
            <label
              className="block text-sm font-bold mb-2 text-white"
              htmlFor={field}
            >
              {field === "Name" && "نام"}
              {field === "lastName" && "تخلص"}
              {field === "fatherName" && "نام پدر"}
              {field === "GfatherName" && "نام پدرکلان"}
              {field === "gender" && "جنسیت"}
              {field === "birthDate" && "تاریخ تولد"}
              {field === "birthPlace" && "محل تولد"}
              {field === "residency" && "محل سکونت"}
              {field === "nation" && "قوم"}
              {field === "religion" && "دین"}
              {field === "NIC" && "نمبر تذکره "}
              {field === "coupleId" && "شماره خانواده"}
            </label>
            {field === "gender" ? (
              <select
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">انتخاب جنسیت</option>
                <option value="مرد">مرد</option>
                <option value="زن">زن</option>
              </select>
            ) : field === "birthDate" ? (
              <input
                id={field}
                name={field}
                type="date"
                value={formData[field]}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors[field] ? "border-red-500" : ""
                }`}
              />
            ) : (
              <input
                id={field}
                name={field}
                type="text"
                value={formData[field]}
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
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-white text-green-950 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ثبت ریکارد
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterWitness;
