
// LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../pages/authContext.jsx';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const  setIsAuthenticated  = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8038/users/login", {
        username,
        password
      });
      const userId = response.data.userId;
      const userRole = response.data.userRole;
      const userMode = response.data.userMode;
      const userZone=response.data.userZone;

      if (userMode === "deactive") {
        setError("این حساب غیر فعال است");
      } else if (userMode === "active") {
        sessionStorage.setItem('token', response.data.token); // Store token in localStorage
        sessionStorage.setItem('id',userId); // Store token in localStorage
        sessionStorage.setItem('zone',userZone); // Store token in localStorage

        // setIsAuthenticated(true); // Update the authentication state
        if (userRole === "مدیر") {
          navigate(`/AdminDashboard`);
        } else {
          navigate(`/UserDashboard`);
        }
      }
    } catch (error) {
      setError("اعتبارنامه نامعتبر است. لطفا دوباره امتحان کنید.");
    }
  };

  return (
    <div className="flex items-center justify-center text-right min-h-screen h-full shadow-md bg-gradient-to-r from-red-950 via-red-700 to-red-950 rounded p-3">
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-sm mx-auto bg-red-950 p-4 rounded shadow-md"
      >
        <h2 className="text-white text-2xl mb-4 text-center">صفحه ورود</h2>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="username"
          >
            نام کاربری
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            رمز عبور
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex">
          <button
            type="submit"
            className="flex-2/3 bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            ورود
          </button>
          <Link to="/">
            <button
              type="button"
              className="flex-1/3 bg-white text-black hover:bg-green-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              برگشت
            </button>
          </Link>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;


