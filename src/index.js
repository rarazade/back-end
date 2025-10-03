import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import gameRoutes from './routes/games.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';
import newsRoutes from './routes/news.js';
import jumbotronRoutes from './routes/jumbotrons.js';

import aboutRoutes from './routes/about.js';
import teamRoutes from './routes/team.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors({
  origin: [process.env.ADMIN_ORIGIN, process.env.CLIENT_ORIGIN],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadDir));

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', gameRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/jumbotrons', jumbotronRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/team', teamRoutes);
app.use((err, req, res, next) => {
console.error('UNCAUGHT ERROR:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
