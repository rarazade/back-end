import * as adminRepository from '../repositories/adminRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 🔑 Login Admin / Superadmin
export async function login(username, password) {
  const admin = await adminRepository.findByUsername(username);
  if (!admin) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
    role: admin.role
  };
}

// 📝 Register Admin (hanya bisa dibuat oleh superadmin)
export async function register(username, password, role = "admin") {
  const existing = await adminRepository.findByUsername(username);
  if (existing) throw new Error("Username already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await adminRepository.create(username, hashedPassword, role);

  return {
    message: "Admin registered",
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role
    }
  };
}
