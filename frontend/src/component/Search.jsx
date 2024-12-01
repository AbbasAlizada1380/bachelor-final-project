import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchAppointments = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setErrorMessage("");
  };

  return (
    <div>
      <button onClick={openPopup} className="p-2 rounded-md">
        جستجو
      </button>
      {isPopupOpen && (
        <CheckForm onClose={closePopup} setErrorMessage={setErrorMessage} />
      )}
      {errorMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-red-950 rounded-lg shadow-lg p-6 w-full max-w-md text-white text-center">
            {errorMessage}
            <button
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-md"
              onClick={() => setErrorMessage("")}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckForm = ({ onClose, setErrorMessage }) => {
  const [searchType, setSearchType] = useState("familyCode");
  const [formData, setFormData] = useState({
    familyCode: "",
    name: "",
    NIC: "",
    mode: "شوهر",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (errors[name]) {
      setErrors((prevState) => ({ ...prevState, [name]: "" }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (searchType === "familyCode") {
      if (!formData.familyCode) {
        validationErrors.familyCode = "کود خانواده نمیتواند خالی باشد";
      }
    } else if (searchType === "specification") {
      if (!formData.name) {
        validationErrors.name = "نام نمیتواند خالی باشد";
      }
      if (!formData.NIC) {
        validationErrors.NIC = "نمبر تذکره نمیتواند خالی باشد";
      }
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (searchType === "familyCode") {
          const response = await axios.post(
            "http://localhost:8038/appointment/searchByFamilyCode",
            { familyCode: formData.familyCode }
          );

          if (response.data.state === "pending") {
            navigate("/pending", {
              state: {
                Id: response.data.id,
                familyCode: response.data.familyCode,
              },
            });
          } else if (response.data.state === "processing") {
            navigate("/processing", {
              state: {
                id: response.data.id,
                appointmentTime: response.data.appointmentTime,
                state: response.data.state,
                familyCode: response.data.familyCode,
                zone: response.data.zone,
              },
            });
          } else if (response.data.state === "done") {
            navigate("/done", {
              state: {
                Id: response.data.id,
                familyCode: response.data.familyCode,
              },
            });
          }
        } else if (searchType === "specification") {
          const response = await axios.post(
            "http://localhost:8038/appointment/searchBySpecification",
            {
              name: formData.name,
              NIC: formData.NIC,
              mode: formData.mode,
            }
          ); 
          if (response.data.state === "pending") {
            navigate("/pending", {
              state: {
                Id: response.data.id,
                familyCode: response.data.familyCode,
              },
            });
          } else if (response.data.state === "processing") {
            navigate("/processing", {
              state: {
                familyCode: response.data.familyCode,
                id: response.data.id,
                appointmentTime: response.data.appointmentTime,
                state: response.data.state,
                zone: response.data.zone,
              },
            });
          } else if (response.data.state === "done") {
            navigate("/done", {
              state: {
                familyCode: response.data.familyCode,
                Id: response.data.id,
              },
            });
          }
        }
       
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage("معلومات مورد نظر یافت نشد");
        } else {
          console.error("Error checking appointment:", error);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-red-950 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 ${
              searchType === "familyCode"
                ? "bg-blue-500 border-2 border-green-300 rounded text-white"
                : "bg-gray-200 text-green-800"
            } rounded`}
            onClick={() => setSearchType("familyCode")}
          >
            جستجو براساس کود خانواده
          </button>
          <button
            className={`px-4 py-2 ${
              searchType === "specification"
                ? "bg-blue-500 border-2 border-green-300 rounded text-white"
                : "bg-gray-200 text-green-800"
            } rounded`}
            onClick={() => setSearchType("specification")}
          >
            جستجو براساس مشخصات
          </button>
        </div>

        {searchType === "familyCode" ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">کود خانواده</label>
              <input
                type="text"
                name="familyCode"
                value={formData.familyCode}
                onChange={handleInputChange}
                className={`mt-1 block w-full border text-black ${
                  errors.familyCode ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
              {errors.familyCode && (
                <p className="text-red-500 text-xs italic">
                  {errors.familyCode}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              جستجو
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">نام</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border text-black ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white">نمبر تذکره</label>
              <input
                type="text"
                name="NIC"
                value={formData.NIC}
                onChange={handleInputChange}
                className={`mt-1 block w-full border text-black ${
                  errors.NIC ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
              {errors.NIC && (
                <p className="text-red-500 text-xs italic">{errors.NIC}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              جستجو
            </button>
          </form>
        )}

        <button
          className="mt-4 w-full bg-red-500 text-white p-2 rounded-md"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default SearchAppointments;
