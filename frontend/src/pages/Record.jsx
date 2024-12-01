import React, { useState, useRef, useEffect } from "react";
import LoadingOverlay from "../component/LoadingOverlay.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

const Record = () => {
  const initialData = {
    Name: "",
    lastName: "",
    fatherName: "",
    GfatherName: "",
    gender: "",
    birthDate: "",
    birthPlace: "",
    residency: "",
    NIC: "",
    nation: "",
    religion: "",
    mode: "",
  };

  const [familyCode, setFamilyCode] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [husbandData, setHusbandData] = useState({
    ...initialData,
    gender: "مرد",
    mode: "شوهر",
  });
  const [wifeData, setWifeData] = useState({
    ...initialData,
    gender: "زن",
    mode: "خانم",
  });
  const [loading, setLoading] = useState(false);
  const [husbandErrors, setHusbandErrors] = useState({});
  const [wifeErrors, setWifeErrors] = useState({});

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const validateField = (name, value) => {
    let errorMsg = "";

    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    if (value.trim() === "") {
      errorMsg = "این فیلد نباید خالی باشد";
    } else if (
      ["Name", "lastName", "fatherName", "GfatherName", "nation"].includes(name) &&
      /\d/.test(value)
    ) {
      errorMsg = "این فیلد نباید حاوی عدد باشد";
    } else if (name === "NIC" && !/^[\d-_]+$/.test(value)) {
      errorMsg = "این فیلد باید فقط شامل اعداد، خط تیره و زیرخط باشد";
    } else if (name === "birthDate" && new Date(value) > tenYearsAgo) {
      errorMsg = "تاریخ تولد باید حداقل ده سال پیش باشد";
    }

    return errorMsg;
  };

  const handleChange = (
    e,
    setData,
    data,
    setErrors,
    errors,
    synchronizeResidency = false,
    isHusband = true
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });

    if (synchronizeResidency && name === "residency") {
      if (isHusband) {
        setWifeData((prevWifeData) => ({ ...prevWifeData, residency: value }));
      } else {
        setHusbandData((prevHusbandData) => ({
          ...prevHusbandData,
          residency: value,
        }));
      }
    }
  };

  const getZoneNumber = (residency) => {
    const zoneMap = {
      1: 5,
      2: 2,
      3: 3,
      4: 6,
      5: 3,
      6: 5,
      7: 5,
      8: 5,
      9: 2,
      10: 2,
      11: 4,
      12: 1,
      13: 3,
      14: 3,
      15: 6,
      16: 1,
      17: 4,
      18: 4,
      19: 6,
      20: 6,
      21: 1,
      22: 1,
    };
    return zoneMap[residency] || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newHusbandErrors = {};
    const newWifeErrors = {};

    Object.keys(husbandData).forEach((key) => {
      const errorMsg = validateField(key, husbandData[key]);
      if (errorMsg) {
        formIsValid = false;
        newHusbandErrors[key] = errorMsg;
      }
    });

    Object.keys(wifeData).forEach((key) => {
      const errorMsg = validateField(key, wifeData[key]);
      if (errorMsg) {
        formIsValid = false;
        newWifeErrors[key] = errorMsg;
      }
    });

    setHusbandErrors(newHusbandErrors);
    setWifeErrors(newWifeErrors);

    if (formIsValid) {
      setLoading(true);

      try {
        const zoneNumber = getZoneNumber(husbandData.residency);
        const coupleData = { husbandData, wifeData, zoneNumber };
        const response = await axios.post(
          "http://localhost:8038/records",
          coupleData
        );
        setMsgSuccess(response.data.message);
        setModalVisible(true);
        setFamilyCode(response.data.familyCode);
        // Reset form data after successful submission
        setHusbandData({ ...initialData, gender: "مرد", mode: "شوهر" });
        setWifeData({ ...initialData, gender: "زن", mode: "خانم" });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDownloadPDF = async () => {
    const input = document.getElementById("form-content");
    const canvas = await html2canvas(input, {
      scale: 2,
      width:900,
      height: 700,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("family-code.pdf");
  };
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center bg-red-950 relative"
    >
      <LoadingOverlay loading={loading} />
      <form className="items-center w-full max-w-2xl" onSubmit={handleSubmit}>
        <div className="bg-dark-red-800 text-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl mb-4 text-center">اطلاعات شوهر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(husbandData).map((key, index) => (
              <div key={key}>
                <label className="block text-sm font-bold mb-2">
                  {key === "Name" && "نام"}
                  {key === "lastName" && "تخلص"}
                  {key === "fatherName" && "نام پدر"}
                  {key === "GfatherName" && "نام پدر کلان"}
                  {key === "gender" && "جنسیت"}
                  {key === "birthDate" && "تاریخ تولد"}
                  {key === "birthPlace" && "محل تولد"}
                  {key === "residency" && "ناحیه سکونت در کابل"}
                  {key === "NIC" && "نمبر تذکره"}
                  {key === "nation" && "قوم"}
                  {key === "religion" && "دین"}
                  {key === "mode" && "حالت"}
                </label>
                {key === "gender" ? (
                  <select
                    name="gender"
                    value={husbandData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setHusbandData,
                        husbandData,
                        setHusbandErrors,
                        husbandErrors
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="مرد">مرد</option>
                  </select>
                ) : key === "mode" ? (
                  <select
                    name="mode"
                    value={husbandData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setHusbandData,
                        husbandData,
                        setHusbandErrors,
                        husbandErrors
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="شوهر">شوهر</option>
                  </select>
                ) : key === "residency" ? (
                  <select
                    name="residency"
                    value={husbandData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setHusbandData,
                        husbandData,
                        setHusbandErrors,
                        husbandErrors,
                        true
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">محل سکونت را انتخاب کنید</option>
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    ref={index === 0 ? nameInputRef : null} // Focus on the first input
                    type={key === "birthDate" ? "date" : "text"}
                    name={key}
                    value={husbandData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setHusbandData,
                        husbandData,
                        setHusbandErrors,
                        husbandErrors
                      )
                    }
                    className={`shadow appearance-none border ${
                      husbandErrors[key] ? "border-red-500" : ""
                    } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  />
                )}
                {husbandErrors[key] && (
                  <p className="text-red-500 text-xs italic">
                    {husbandErrors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-red-800 text-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl mb-4 text-center">اطلاعات خانم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(wifeData).map((key, index) => (
              <div key={key}>
                <label className="block text-sm font-bold mb-2">
                  {key === "Name" && "نام"}
                  {key === "lastName" && "تخلص"}
                  {key === "fatherName" && "نام پدر"}
                  {key === "GfatherName" && "نام پدر کلان"}
                  {key === "gender" && "جنسیت"}
                  {key === "birthDate" && "تاریخ تولد"}
                  {key === "birthPlace" && "محل تولد"}
                  {key === "residency" && "ناحیه سکونت در کابل"}
                  {key === "NIC" && "نمبر تذکره"}
                  {key === "nation" && "قوم"}
                  {key === "religion" && "دین"}
                  {key === "mode" && "حالت"}
                </label>
                {key === "gender" ? (
                  <select
                    name="gender"
                    value={wifeData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setWifeData,
                        wifeData,
                        setWifeErrors,
                        wifeErrors
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="زن">زن</option>
                  </select>
                ) : key === "mode" ? (
                  <select
                    name="mode"
                    value={wifeData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setWifeData,
                        wifeData,
                        setWifeErrors,
                        wifeErrors
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="خانم">خانم</option>
                  </select>
                ) : key === "residency" ? (
                  <select
                    name="residency"
                    value={wifeData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setWifeData,
                        wifeData,
                        setWifeErrors,
                        wifeErrors,
                        true,
                        false
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">محل سکونت را انتخاب کنید</option>
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={key === "birthDate" ? "date" : "text"}
                    name={key}
                    value={wifeData[key]}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setWifeData,
                        wifeData,
                        setWifeErrors,
                        wifeErrors
                      )
                    }
                    className={`shadow appearance-none border ${
                      wifeErrors[key] ? "border-red-500" : ""
                    } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  />
                )}
                {wifeErrors[key] && (
                  <p className="text-red-500 text-xs italic">
                    {wifeErrors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ارسال
          </button>
          <Link  to='/ '  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">برگشت</Link>
        </div>
      </form>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="mb-4">{msgSuccess}</p>
            <p id="form-content" className="mb-4">{`کد خانواده: ${familyCode}`}</p>
            <button
              onClick={() => {setModalVisible(false),handleDownloadPDF()}}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              دانلود کد خانواده
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Record;
