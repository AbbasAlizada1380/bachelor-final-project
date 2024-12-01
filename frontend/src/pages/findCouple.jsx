import React, { useState } from "react";
import axios from "axios";

const SendToDatabase = ({ id }) => {
  const [Name, setName] = useState("");
  const [NIC, setNIC] = useState("");
  const [records, setRecords] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [notAllowedMessageVisible, setNotAllowedMessageVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mode = "شوهر";

    try {
      const userZone = await axios.get(`http://localhost:8038/users/${id}`);
      const res = await axios.post(
        "http://localhost:8038/appointment/searchBySpecification",
        {
          name: Name,
          NIC,
          mode,
        }
      );
      
      if (userZone.data.zone === res.data.zone) {
        const response = await axios.post(
          "http://localhost:8038/records/findFamily",
          {
            Name,
            NIC,
            mode,
          }
        );

        setRecords(response.data);
        setMessage("داده با موفقیت دریافت شد");
        setMessageType("success");
      } else {
        // Show "not allowed" message for 5 seconds
        setNotAllowedMessageVisible(true);
        setTimeout(() => {
          setNotAllowedMessageVisible(false);
        }, 5000);
        
        setMessage(null); // Clear previous messages
      }
    } catch (error) {
      setMessage("خطا در ارسال داده");
      setMessageType("error");
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 justify-center bg-red-950 relative">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-red-600 text-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            نام شوهر
          </label>
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
          <label htmlFor="NIC" className="block text-sm font-medium text-white">
            نمبر تذکره
          </label>
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ارسال
        </button>
      </form>

      {notAllowedMessageVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-red-600">
            <p>شما مجاز به انجام این عمل نیستید</p>
            <button
              onClick={() => setNotAllowedMessageVisible(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            <p>{message}</p>
            <button
              onClick={() => {
                setMessage(null);
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {records && (
        <div className="mt-8 w-full max-w-4xl">
          <Table
            className="align-middle text-center"
            person={records.husband.name}
            fatherName={records.husband.fatherName}
            NIC={records.husband.NIC}
            mode={records.husband.mode}
          />
          {records.wife && (
            <Table
              className="align-middle text-center"
              person={records.wife.name}
              fatherName={records.wife.fatherName}
              NIC={records.wife.NIC}
              mode={records.wife.mode}
            />
          )}
          {records.witnesses &&
            records.witnesses.map((wit, index) => (
              <Table
                className="align-middle text-center"
                key={index}
                person={wit.name}
                fatherName={wit.fatherName}
                NIC={wit.NIC}
                mode={wit.mode}
              />
            ))}
          {records.children &&
            records.children.map((child, index) => (
              <Table
                className="align-middle text-center"
                key={index}
                person={child.name}
                fatherName={child.fatherName}
                mode="فرزند"
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Table = ({ person, fatherName, NIC, mode }) => (
  <table className="min-w-full bg-white my-4">
    <thead>
      <tr>
        <th className="py-2 px-4 border-b">نام</th>
        <th className="py-2 px-4 border-b">نام پدر</th>
        <th className="py-2 px-4 border-b">نمبر تذکره</th>
        <th className="py-2 px-4 border-b">عنوان</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="py-2 px-4 border-b">{person}</td>
        <td className="py-2 px-4 border-b">{fatherName}</td>
        <td className="py-2 px-4 border-b">{NIC}</td>
        <td className="py-2 px-4 border-b">{mode}</td>
      </tr>
    </tbody>
  </table>
);

export default SendToDatabase;
