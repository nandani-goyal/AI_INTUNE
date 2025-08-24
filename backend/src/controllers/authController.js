import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateAnon from '../utils/generateAnon.js';

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: 'All fields required' });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already in use' });

    const user = await User.create({
      name,
      email,
      password,
      anonymousId: generateAnon()
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ msg: 'Invalid credentials' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
};
