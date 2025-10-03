import * as adminRepository from '../repositories/adminRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (username, password, role = "admin") => {
  const existing = await adminRepository.findByUsername(username);
  if (existing) throw new Error('Username already exists');

  const hashed = await bcrypt.hash(password, 10);
  const admin = await adminRepository.create(username, hashed, role);

  return { 
    message: 'Admin registered', 
    admin: { id: admin.id, username: admin.username, role: admin.role } 
  };
};

export const login = async (username, password) => {
  const admin = await adminRepository.findByUsername(username);
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { message: 'Login successful', token };
};
