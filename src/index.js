import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import gameRoutes from './routes/games.js';
import newsRoutes from './routes/news.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';

// ES module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// buat folder uploads jika belum ada (dengan path absolut)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // kalau butuh form-urlencoded

// serve file statis upload secara eksplisit dengan path absolut
app.use('/uploads', express.static(uploadDir));

// health check (opsional tapi berguna)
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', gameRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admins', adminRoutes);

// centralized error handler (paling bawah)
app.use((err, req, res, next) => {
  console.error('UNCAUGHT ERROR:', err);

  // khusus untuk error dari multer
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
