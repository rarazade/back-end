import * as newsRepository from "../repositories/newsRepository.js";

export const getAllNews = () => {
  return newsRepository.getAllNews();
};

export const getNewsById = (id) => {
  return newsRepository.getNewsById(id);
};

export const createNews = (data) => {
  return newsRepository.createNews(data);
};

export const updateNews = (id, data) => {
  return newsRepository.updateNews(id, data);
};

export const deleteNews = (id) => {
  return newsRepository.deleteNews(id);
};
