import * as newsService from '../services/newsService.js';

export const getAllNews = async (req, res) => {
  try {
    const news = await newsService.getAllNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNewsById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const news = await newsService.getNewsById(id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const newNews = await newsService.createNews(req.body);
    res.status(201).json(newNews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateNews = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const updated = await newsService.updateNews(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteNews = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await newsService.deleteNews(id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
