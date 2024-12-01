import { useState } from "react";
import { Link } from "react-router-dom";

function Instruction() {

  return (
    <div className="flex flex-col items-center p-8 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1
        className="text-3xl font-bold mb-6 text-gray-800 flex items-center"
        dir="rtl"
      >
        مراحل اخذ نکاح خط :
      </h1>
      <ol
        className=" text-xl items-start list-decimal  space-y-4 text-gray-700"
        dir="rtl"
      >
        <li className="it">
          جمع‌آوری مدارک لازم: تذکره های خانم و شوهر
        </li>
        <li>
          پر کردن فرم درخواست: شامل اطلاعات شخصی است
        </li>
        <li>رزرو وقت از محکمه وثایق شهرکابل </li>
        <li>مراجعه به محکمه در زمان رزو شده از طرف محکمه وثایق شهر کابل </li>
        <li>تهیه مدارک لازم برای محکمه در زمان مراجعه(فورم که از طرف سیستم چاپ خواهد شد خانه پری شده.دو-دو قطعه عکس و اصل تذکره هر یک شوهر،خانم و شاهدین)</li>
        <li>مراجعه به محکمه در روز معین شده از طرف محکمه به منظور اخذ نکاح‌خط </li>
<p className="text-red-500">نوت: تمام خدمات محکمه وثایق به شمول توزیع نکاح خط برای هموطنان به طور رایگان بوده هیچکس حق دریافت هزینه مالی را ندارد. با متخلفین برخورد قانونی میگردد.</p>
      </ol>
      <Link to="/records">
        <button className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
          درخواست جدید برای اخد نکاح خط
        </button>
      </Link>
    </div>
  );
}
export default Instruction;
