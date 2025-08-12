import { deleteImageNews } from "../repositories/newsRepository.js";
import * as newsService from "../services/newsService.js";

export const getAllNews = async (req, res) => {
  try {
    const newsList = await newsService.getAllNews();
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news." });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await newsService.getNewsById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news." });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, date, excerpt, content } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imagePath = req.file.filename;

    const news = await newsService.createNews({
      title,
      date: new Date(date),
      excerpt,
      content,
      image: imagePath,
    });

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to create news." });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, date, excerpt, content } = req.body;
    const id = req.params.id;

    const existing = await newsService.getNewsById(id);
    if (!existing) return res.status(404).json({ error: "News not found" });

    let imagePath = existing.image;
    if (req.file) {
      imagePath = req.file.filename;
      await deleteImageNews(id)
    }

    const updated = await newsService.updateNews(id, {
      title,
      date: date ? new Date(date) : existing.date,
      excerpt,
      content,
      image: imagePath,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update news." });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const existing = await newsService.getNewsById(req.params.id);
    if (!existing) return res.status(404).json({ error: "News not found" });

    await deleteImageNews(req.params.id)
    await newsService.deleteNews(req.params.id);
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete news." });
  }
};
