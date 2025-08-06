import * as newsRepo from '../repositories/newsRepository.js';

export const getAllNews = () => newsRepo.getAllNews();

export const getNewsById = (id) => newsRepo.getNewsById(id);

export const createNews = (data) => {
  const { title, image, date, excerpt, content } = data;
  if (!title || !image || !date || !excerpt || !content) {
    throw new Error('All fields are required');
  }

  return newsRepo.createNews({
    title,
    image,
    date: new Date(date),
    excerpt,
    content,
  });
};

export const updateNews = (id, data) => {
  const { title, image, date, excerpt, content } = data;
  if (!title || !image || !date || !excerpt || !content) {
    throw new Error('All fields are required');
  }

  return newsRepo.updateNews(id, {
    title,
    image,
    date: new Date(date),
    excerpt,
    content,
  });
};

export const deleteNews = (id) => newsRepo.deleteNews(id);
