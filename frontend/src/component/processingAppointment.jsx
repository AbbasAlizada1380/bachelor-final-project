import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DownloadPdfComponent from "../pages/Request";
import FormDownload from "./formDownload";

const ProcessingAppointment = () => {
  const navigate=useNavigate()
  const goBack = () => {
   navigate(-1)
  };
  const Location = useLocation();
  const { id, appointmentTime, state, familyCode, zone } = Location.state;
  let familyId = id;
  let time = appointmentTime;
  time = time.split("T")[0];
  let FamilyCode = familyCode;
  let Zone = zone;
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-950">
      <div className=" bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl text-green-500">نوبت شما فرارسیده است</h1>
        <h2 className="text-2xl mb-4 text-green-500">
          لطفاً در زمان تعیین شده به مرکز بیایید
        </h2>
        <p className="text-black">زمان ملاقات شما: {time}</p>
        <p className="text-black"> آي ‌دی شما:{familyId}</p>
        <p className="text-black">کود فامیل:{FamilyCode}</p>
        <p className="text-black">زون:{Zone}</p>
        <div className="">
          {" "}
          <a href="MarriageRequestForm.html" className="flex" download>
            <FormDownload familyId={familyId} zone={zone} />
          </a>
        </div>
            <button
              onClick={goBack}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              بازگشت
            </button>
      </div>
    </div>
  );
};

export default ProcessingAppointment;
