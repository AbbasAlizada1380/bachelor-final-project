import React, { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import axios from "axios";

const Profilepage = () => {
  const match = useMatch("/profile/:id");
  const id = match.params.id;
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    image: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8038/users/${id}`);
        const { name, username, email, image, password,zone } = response.data;
        setFormData({ name, username, password, email, image, });
        setPreviewUrl(`http://localhost:8038/uploads/${image}`);
      } catch (error) {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('username', formData.username);
    if (formData.password) {
      data.append('password', formData.password);
    }
    data.append('email', formData.email);
    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.put(`http://localhost:8038/users/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('کاربر به روز شد:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('خطا در به روز رسانی کاربر:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-red-950 via-red-400 to-red-950 shadow-md  rounded p-3">
      <div className="max-w-2xl mx-auto my-8 p-6 bg-gradient-to-tr from-red-950 via-red-400 to-red-950 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">پروفایل کاربر</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-blue-400"
            >
              ویرایش پروفایل
            </button>
          )}
        </div>

        <div className="flex flex-col items-center">
          {previewUrl && (
            <img 
              src={previewUrl}
              alt="Profile"
              className="w-32 bg-gray-50 h-32 rounded-full object-cover mb-4"
            />
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">نام:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                readOnly={!isEditing}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">نام کاربری:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                readOnly={!isEditing}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">رمز عبور:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                readOnly={!isEditing}
                placeholder={isEditing ? 'رمز عبور جدید را وارد کنید' : ''}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">ایمیل:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                readOnly={!isEditing}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">عکس پروفایل:</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className={`w-full mt-1 p-2 border border-gray-300 rounded-md ${isEditing ? '' : 'hidden'}`}
              />
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                >
                  ذخیره
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
