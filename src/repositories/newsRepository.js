import prisma from "../prisma/client.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllNews = async () => {
  return await prisma.news.findMany({
    orderBy: { date: "desc" },
  });
};

export const getNewsById = async (id) => {
  return await prisma.news.findUnique({
    where: { id: id },
  });
};

export const createNews = async (data) => {
  return await prisma.news.create({
    data,
  });
};

export const updateNews = async (id, data) => {
  return await prisma.news.update({
    where: { id: id },
    data,
  });
};

export const deleteImageNews = async (id) => {
  const data = await prisma.news.findUnique({ where: { id: id } });

  fs.unlink(`${path.join(__dirname, "../../uploads")}/${data.image}`, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully.");
      // Send a success response
    }
  });
};

export const deleteNews = async (id) => {
  return await prisma.news.delete({
    where: { id: id },
  });
};
