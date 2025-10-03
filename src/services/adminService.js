import * as adminRepository from "../repositories/adminRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// 🔑 Login Admin / Superadmin
export async function login(username, password) {
  const admin = await adminRepository.findByUsername(username);
  if (
    username === process.env.SUPERADMIN_USERNAME ||
    password === process.env.SUPERADMIN_PASSWORD
  ) {
    const token = jwt.sign({ username, role: "superadmin" }, JWT_SECRET, {
      expiresIn: "1d",
    });
    return {
      message: "Login successful",
      token,
      role: admin.role,
    };
  } else if (admin) {
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ username, role: admin.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    return {
      message: "Login successful",
      token,
      role: admin.role,
    };
  } else {
    throw new Error("Invalid credentials");
  }
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
      role: admin.role,
    },
  };
}
