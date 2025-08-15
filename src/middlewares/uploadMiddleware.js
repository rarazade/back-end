import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import prisma from '../prisma/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix: path absolut
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `zzzzz222-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const createUpload = multer({storage}).fields([
    { name: 'img', maxCount: 1 },
    { name: 'screenshots', maxCount: 12 },
    { name: 'videos', maxCount: 5 },
]);
const updateUpload = multer({ storage, fileFilter: async (req, file, cb) => {
  if (!req._screenshotCount) req._screenshotCount = 0
  if (!req._videosCount) req._videosCount = 0
  const dataScreenshot = await prisma.screenshot.findMany({where: { gameId: Number(req.params.id) }})
  const dataVideos = await prisma.videoSlider.findMany({where: { gameId: Number(req.params.id) }})
  if (file.fieldname == 'screenshots') {
    req._screenshotCount++
    if (req._screenshotCount + dataScreenshot.length > 12) {
      return cb(new Error('Screenshot tidak lebih dari 12'), false)
    }
  }

  if (file.fieldname == 'videos') {
    req._videosCount++
    if (req._videosCount + dataVideos.length > 5) {
      return cb(new Error('Videos tidak lebih dari 5'), false)
    }
  }

  cb(null, true)
} }).fields([
    { name: 'img', maxCount: 1 },
    { name: 'screenshots', maxCount: 12 },
    { name: 'videos', maxCount: 5 },
])

export const uploadGameAssets = (req, res, next) => {
  createUpload(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        if (err.fields == 'videos') {
          return res.status(400).json({message : 'Videos tidak lebih dari 5'})
        }
        return res.status(400).json({message : 'Screenshot tidak lebih dari 12'})
      }
      return res.status(400).json({message: err.message})
    }
    next()
  })
}

export const updateGameMiddleware = (req, res, next) => {
  updateUpload(req, res, async function(err){
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        if (err.fields == 'videos') {
          return res.status(400).json({message : 'Videos tidak lebih dari 5'})
        }
        return res.status(400).json({message : 'Screenshot tidak lebih dari 12'})
      }
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}
export const uploadNewsFiles = upload.single("img");