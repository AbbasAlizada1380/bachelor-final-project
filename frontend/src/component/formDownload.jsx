// src/MarriageForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FormDownload = ({ familyId,zone }) => {
  const [id, setid] = useState(familyId);
  const [formData, setFormData] = useState({
    groomName: "",
    groomFatherName: "",
    groomGfatherName: "",
    groomAddress: "",
    brideName: "",
    brideFatherName: "",
    brideGfatherName: "",
    brideAddress: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const specification = await axios.post(
          "http://localhost:8038/records/getName",
          { id }
        );
        setFormData({
          groomName: specification.data[0].Name,
          groomFatherName: specification.data[0].fatherName,
          groomGfatherName: specification.data[0].GfatherName,
          groomAddress: specification.data[0].residency,
          brideName: specification.data[1].Name,
          brideFatherName: specification.data[1].fatherName,
          brideGfatherName: specification.data[1].GfatherName,
          brideAddress: specification.data[1].residency,
        });
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadPDF = async () => {
    const input = document.getElementById("form-content");
    const canvas = await html2canvas(input, {
      scale: 2,
      width:630,
      height: 1300,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("marriage-form.pdf");
  };

  return (
    <div
      dir="rtl"
      className="form-container items-center flex flex-col p-8 bg-gray-100 min-h-screen"
    >
      <div
        id="form-content"
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl"
      >
        <div className="text-center mb-8 items-center">
          <h2 className="text-2xl font-bold mb-2">درخواست نکاح‌خط</h2>
          <h3 className="text-xl font-semibold">شهرت درخواست کنندگان</h3>
          <h3 className="text-xl font-semibold">  شماره فامیل درخواست کنندگان {id}</h3>
        </div>
        <p className="mb-4 text-right">به مقام محترم محکمه وثایق شهر کابل زون: {zone}</p>
        <p className="mb-4 text-right">
          ما دو نفر هر یک {formData.groomName} ولد/بنت {formData.groomFatherName}{" "}
          ولدیت {formData.groomGfatherName} باشنده ناحیه {formData.groomAddress} و
          {formData.brideName} ولد/بنت {formData.brideFatherName} ولدیت{" "}
          {formData.brideGfatherName} باشنده ناحیه {formData.brideAddress} در حال
          داشتن اهلیت کامل حقوقی به رضا و رغبت خود میخواهیم ازدواج نماییم،
          خواهشمندیم در طی مراحل و توثیق عقد نکاح ما به شعبه مربوط خویش هدایت
          فرمایید.
        </p>
        <div className="mb-4 ">
          محل امضا درخواست کنندگان: <br />
          <br />
          <div className="flex">
            <p className=" w-1/2 text-right">".........................." </p>{" "}
            <p className="w-1/2 text-left"> "............................"</p>
          </div>
        </div>
        <hr />
        <hr />
        <hr />
        <br />
        <p className="mb-4 text-right">
          فورم هذا به منظور طی مراحل به مراجع مربوط ارسال گردید.
        </p>
        <div className="mb-4 ">
          <p className="text-right">
            محل امضا رئیس محکمه یا آمر اداره ثبت و اسناد و وثایق: <br />
            <br />
          </p>
          <p className="text-left w-1/3">
            " ................................"
          </p>{" "}
        </div>
        <br />
        <br />
        <hr />
        <hr />
        <hr />
        <br />
        <br />
        <p className="mb-4 text-right">
          <p>تصدیق اهالی گذر:</p> با درخواست کنندگان معرفت کامل داریم و در
          ازدواج شان موانع شرعی و قانونی وجود نداریم. در صورت خلاف مسوول و
          جوابده میباشیم.
        </p>
        <div className="mb-4 text-right">
          محل امضا و اثر انگشت سه نفر از همجواران و ملا امام مسجد:{" "}
          <div className=" grid grid-cols-2 grid-rows-2">
            <p>................</p>
            <p>................</p>
            <p>................</p>
            <p>................</p>
          </div>
        </div>
        <hr />
        <hr />
        <hr />
        <br />
        <br />
        <p className="mb-4 text-right">تصدیق وکیل گذر یا قریه‌دار:</p>
        <div className="flex w-full ">
          {" "}
          <p className="mb-4 text-right">
            {" "}
            از تحریر فوق اهالی و ملا امام مسجد تصدیق است.{" "}
          </p>
          <p className="text-left w-1/3">محل مهر: .................</p>
        </div>{" "}
        <br />
        <hr />
        <hr />
        <hr />
        <br />
        <br />
        <br />
        <p className="mb-4 text-right">تصدیق اداره محل (ناحیه یا ولسوالی):</p>
        <div className=" flex">
          <p className=" text-right float-right w-2/3">
            از برحالی وکیل گذر یا قریه‌دار تصدیق است.
          </p>
          <p className="float-left">محل مهر: ..................</p>
        </div>
        <br />
        <hr />
        <hr />
        <hr />
        <br />
        <br />
        <p className="text-right">شعبه مربوطه:</p>
        <p className="mb-4 text-right w-1/3">
           نکاحنامه مطلوبه را اجرا نمایند.  </p>محل امضا رئیس
          محکمه یا آمر اسناد و وثایق: ..................
       
      </div>
      <button
        onClick={handleDownloadPDF}
        className="mt-8 w-32 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
      >
       دانلود فورم
      </button>
    </div>
  );
};

export default FormDownload;
