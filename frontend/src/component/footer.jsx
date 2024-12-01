import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import {
  FaYoutube,
  FaPhone,
  FaMap,
  FaVoicemail,
  FaLocationArrow,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-red-950 text-white py-8 px-8">
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div
          className="md:float-start sm:float-start lg:float-start m-4 flex flex-col"
          dir="rtl"
        >
          <h2 className="text-lg font-semibold mb-4" dir="rtl">
            پیشنهادات و انتقادات
          </h2>
          <p>
            "اگر هرگونه اعتراضی یا نگرانی دارید، لطفاً از طریق تلفن یا ایمیل با
            ما تماس بگیرید"
          </p>
        </div>
        <div className="md:float-end sm:float-end  lg:float-end flex flex-col items-end">
          <h2 className="text-lg font-semibold mb-4">ارتباط با ما</h2>
          <div className="flex">
            {" "}
            <p className="flex mb-2">
              <a> (123) 456-7890:</a>{" "}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
          </div>
          <p className="flex items-start mb-2" dir="rtl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <a href="https://www.google.com/maps/place/%D8%AF+%D9%88%D8%AB%D8%A7%D9%8A%D9%82%D9%88+%D9%85%D8%AD%DA%A9%D9%85%D9%87+%D9%88%D8%AB%D8%A7%D9%8A%D9%82+Documentation+law+court%E2%80%AD/@34.497168,69.1606388,16.71z/data=!4m14!1m7!3m6!1s0x38d16926af12ad55:0xb2a267ec0f7d9545!2z2K8g2YjYq9in2YrZgtmIINmF2K3aqdmF2Ycg2YjYq9in2YrZgiBEb2N1bWVudGF0aW9uIGxhdyBjb3VydA!8m2!3d34.4970476!4d69.1577919!16s%2Fg%2F11n035871v!3m5!1s0x38d16926af12ad55:0xb2a267ec0f7d9545!8m2!3d34.4970476!4d69.1577919!16s%2Fg%2F11n035871v?entry=ttu">
              :جنگلک ،کابل، افغانستان
            </a>
            <span className="mr-2"></span>{" "}
          </p>
          <p className="flex items-center mb-2">
            <a
              href="mailto:example@gmail.com"
              className="text-blue-200 hover:underline"
            >
              example@gmail.com:
            </a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </p>
          <div className="flex items-center mb-2">
            <a
              href="https://www.youtube.com/channel/UCXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:underline"
            >
              Our Channel:
            </a>
            <FaYoutube size={23} /></div>
          
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4">
        <div className="flex justify-center space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={32} className="text-white" />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={32} className="text-white" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={32} className="text-white" />
          </a>
        </div>
        <div className="text-center text-sm mt-4">
          <p>{currentYear} Alizada.</p>
          <p >.تمامی حقوق محفوظ است</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
