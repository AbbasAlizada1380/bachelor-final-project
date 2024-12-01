import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersInZone = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const zone=sessionStorage.getItem('zone')
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8038/users/zone/${zone}`);
        setUsers(response.data);
      } catch (err) {
        setError("خطا در بازیابی کاربران");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [zone]);

  if (loading) {
    return <p>بارگذاری...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl mb-4 text-white text-center">کاربران در زون {zone}</h2>
      {users.length === 0 ? (
        <p>هیچ کاربری در این زون وجود ندارد</p>
      ) : (
        <ul className="w-full max-w-md bg-red-800 text-white p-6 rounded-lg shadow-md">
          {users.map((user) => (
            <li key={user.id} className="border-b border-gray-300 py-2">
              <p>نام: {user.name}</p>
              <p>نام کاربری: {user.username}</p>
              <p>ایمیل: {user.email}</p>
              <p>نقش: {user.role}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersInZone;
