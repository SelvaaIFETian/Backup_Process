const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();


exports.registerUser = async (req, res) => {
  const { name, email, password, role, phone, gender, age, location, pincode } = req.body;

  console.log('Register Request Body:', req.body); // 🔍 Debug incoming data

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate role value
    const validRoles = ['seeker', 'recruiter', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      gender,
      age,
      location,
      pincode
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};


// ✅ Login User
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: `You are not authorized as ${role}` });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Make sure this is defined in .env
      { expiresIn: '1h' } // Optional expiry
    );

    res.status(200).json({
      message: 'Login successful',
      token,       // ✅ Send token to frontend
      user         // Optional: send user info
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch Users Error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ✅ Update User Profile
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(updateData);
    res.status(200).json(user);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// ✅ Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

// ✅ Get User by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Fetch User by ID Error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

