import * as adminService from '../services/adminService.js';

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await adminService.register(username, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await adminService.login(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
