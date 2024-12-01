import React, { useState } from "react";
import LoadingOverlay from "../component/LoadingOverlay.jsx";
import axios from "axios";

const RegisterChild = ({ id }) => {
  const initialData = {
    Name: "",
    lastName: "",
    gender: "",
    birthDate: "",
    birthPlace: "",
    parentId: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [msgSuccess, setMsgSuccess] = useState("");
  const [msgError, setMsgError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = "";

    if (value.trim() === "") {
      errorMsg = "این فیلد نباید خالی باشد";
    } else if (["Name", "lastName"].includes(name) && /\d/.test(value)) {
      errorMsg = "این فیلد نباید حاوی عدد باشد";
    } else if (name === "parentId" && !/^\d+$/.test(value)) {
      errorMsg = "این فیلد باید فقط شامل اعداد باشد";
    } else if (name === "birthDate" && new Date(value) > new Date()) {
      errorMsg = "تاریخ تولد نباید در آینده باشد";
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let formIsValid = true;
    const newErrors = {};
  
    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        formIsValid = false;
        newErrors[key] = errorMsg;
      }
    });
  
    setErrors(newErrors);
  
    if (formIsValid) {
      setLoading(true);
  
      try {
        const userZone = await axios.get(`http://localhost:8038/users/${id}`);
        const parentId = formData.parentId;
        const parentZone = await axios.get(`http://localhost:8038/appointment/${parentId}`);
  
        if (userZone.data.zone === parentZone.data.zone) {
          await axios.post("http://localhost:8038/children", formData);
          setMsgSuccess("فرزند با موفقیت ثبت شد");
          setMsgError("");
          setModalVisible(true);
  
          setFormData(initialData);
  
          // Hide modal after 5 seconds
          setTimeout(() => {
            setModalVisible(false);
          }, 5000);
        } else {
          setMsgError("شما مجاز به افزودن فرزند نیستید");
          setMsgSuccess("");
          setModalVisible(true);
  
          // Hide modal after 5 seconds
          setTimeout(() => {
            setModalVisible(false);
          }, 5000);
        }
      } catch (error) {
        console.error("Error:", error);
        setMsgError("خطا در ثبت اطلاعات");
        setMsgSuccess("");
        setModalVisible(true);
  
        // Hide modal after 5 seconds
        setTimeout(() => {
          setModalVisible(false);
        }, 5000);
      } finally {
        setLoading(false);
      }
    }
  };
  
  

  return (
    <div className="flex flex-col items-center p-4 justify-center bg-red-950 relative">
      <LoadingOverlay loading={loading} />
      <form className="w-full max-w-md bg-red-600 text-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 text-center">ورود اطلاعات فرزند</h2>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(initialData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-bold mb-2">
                {key === "Name" && "نام"}
                {key === "lastName" && "تخلص"}
                {key === "gender" && "جنسیت"}
                {key === "birthDate" && "تاریخ تولد"}
                {key === "birthPlace" && "محل تولد"}
                {key === "parentId" && "شماره خانواده "}
              </label>
              {key === "gender" ? (
                <select
                  name="gender"
                  value={formData[key]}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="مرد">مرد</option>
                  <option value="زن">زن</option>
                </select>
              ) : (
                <input
                  type={key === "birthDate" ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors[key] ? "border-red-500" : ""
                  }`}
                />
              )}
              {errors[key] && <p className="text-black text-xs italic">{errors[key]}</p>}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-dark-red-800 bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            ارسال
          </button>
        </div>
      </form>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {msgSuccess && <p className="text-center text-green-600">{msgSuccess}</p>}
            {msgError && <p className="text-center text-red-600">{msgError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterChild;
