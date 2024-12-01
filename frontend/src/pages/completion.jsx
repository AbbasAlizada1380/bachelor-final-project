import React, { useState } from "react";
import axios from "axios";

const Completion = () => {
  const [Name, setName] = useState("");
  const [NIC, setNIC] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSuccess, setPopupSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mode = "شوهر";

    try {
      const response = await axios.post('http://localhost:8038/records/complete', {
        Name,
        NIC,
        mode,
      });

      // Handle success response
      setPopupMessage("معلومات موفقانه ارسال گردید");
      setPopupSuccess(true);
      setNIC('')
      setName('')
    
      setTimeout(() => setPopupMessage(""), 3000);
    } catch (error) {
      // Handle error response
      setPopupMessage("خطا: معلومات ارسال نشد");
      setPopupSuccess(false);
      setTimeout(() => setPopupMessage(""), 3000);
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 justify-center bg-red-950 relative min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-red-600 text-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-white">نام شوهر</label>
          <input
            type="text"
            id="name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 block w-full text-black rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="NIC" className="block text-sm font-medium text-white">نمبر تذکره</label>
          <input
            type="text"
            id="NIC"
            value={NIC}
            onChange={(e) => setNIC(e.target.value)}
            required
            className="mt-1 p-2 block w-full text-black rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ارسال
        </button>
      </form>
      {popupMessage && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg z-20 ${popupSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {popupMessage}
          </div>
        </>
      )}
    </div>
  );
};

export default Completion;
