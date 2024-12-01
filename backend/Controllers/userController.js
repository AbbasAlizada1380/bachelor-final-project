import User from "../Models/user.js";
import fs from 'fs'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { log } from "console";


export const getUsersByZone = async (req, res) => {
  const { zone } = req.params;

  try {
    // Fetch users who are in the same zone
    const users = await User.findAll({
      where: { zone: zone, mode: "active" }, // Assuming "mode" indicates if the user is active
      attributes: ['id', 'name', 'username', 'email', 'role'], // Select the necessary fields
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'هیچ کاربری در این زون وجود ندارد' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by zone:', error);
    res.status(500).json({ error: 'خطا در بازیابی کاربران' });
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'نام کاربری یا رمز عبور نادرست است.' });
    }
    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'نام کاربری یا رمز عبور نادرست است.' });
    }

    // Check if the user account is active
    if (user.mode === 'deactive') {
      return res.status(403).json({ message: 'این حساب غیر فعال است.' });
    }
    
    const secretKey = 'abbas'; // Store this in an environment variable
    const payload = { userId: user.id, userRole: user.role, userMode: user.mode };
    const token=jwt.sign(payload,secretKey,{expiresIn:'1h'})

    // Send the response with user details
    res.status(200).json({
      token,
      userId: user.id,
      userRole: user.role,
      userMode: user.mode,
      userZone:user.zone,
      message: 'ورود موفقیت آمیز بود.'
    });
  } catch (error) {
    res.status(500).json({ message: 'خطایی رخ داد. لطفا دوباره تلاش کنید.' });
  }
};

// Controller function to create a new user
export const createUser = async (req, res) => {
  const { name, userName, Password, email, role, zone,mode } = req.body;


  // Basic validation
  if (!name || !userName || !Password || !email || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (Password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (role !== 'کاربر' && role !== 'مدیر') {
    return res.status(400).json({ error: 'Role must be either user or admin' });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username: userName } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(Password, 6);

    // Create the new user record
    const newUser = await User.create({
      name,
      username: userName,
      password: hashedPassword,
      email,
      role,
      zone,mode
    });

    // Send success response
    res.status(201).json({ message: 'User created successfully!', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

// Fetch user details by ID
export const getUserDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['name', 'username', 'password', 'email', 'image', 'role', 'zone'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateUser = async (req, res) => {

  const { name, username, password, email, } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    console.log(image);
    const user = await User.findByPk(req.params.id);

    if (image) {
      if (fs.existsSync(`uploads/${user.image}`)) {
        fs.unlinkSync(`uploads/${user.image}`);
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.username = username;
    if (password) {
      user.password = password; // Ensure to hash the password before saving
    }
    user.email = email;
    if (image) {
      user.image = image;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
  // });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user||user.mode==='deactive') {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({mode:'deactive'});
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(id);
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
     





