import fs from "fs";
import path from "path";
import {
  createAbout,
  updateAbout,
  getAllAbout,
  getAboutById,
  deleteAbout,
  deleteAboutImage,
  addAboutImages,
  
} from "../repositories/aboutRepository.js";

const uploadDir = path.join(process.cwd(), "uploads");

export const createAboutService = (data, images) => createAbout(data, images);
export const updateAboutService = (id, data, images) => updateAbout(id, data, images);
export const getAboutsService = () => getAllAbout();
export const getAboutService = (id) => getAboutById(id);

export const deleteAboutService = async (id) => {
  const about = await deleteAbout(id);

  // Hapus semua file gambar & foto team
  about.images.forEach((img) => {
    const filePath = path.join(uploadDir, img.url);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`Failed to delete image file: ${filePath}`, err);
    }
  });

  about.teamMembers.forEach((tm) => {
    if (tm.photo) {
      const filePath = path.join(uploadDir, tm.photo);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Failed to delete team member photo: ${filePath}`, err);
      }
    }
  });

  return about;
};

export const deleteAboutImageService = async (id) => {
  const image = await deleteAboutImage(id);

  if (image.url) {
    const filePath = path.join(uploadDir, image.url);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`Failed to delete image file: ${filePath}`, err);
    }
  }

  return image;
};

export const addAboutImagesService = async (aboutId, images) => {
  const about = await getAboutById(aboutId);
  if (!about) throw new Error("About not found");

  const existingBanner = about.images.find((img) => img.type === "BANNER");

  const hasNewBanner = images.some((img) => img.type === "BANNER");
  if (existingBanner && hasNewBanner) {
    throw new Error("Banner image already exists. Only 1 banner allowed.");
  }

  return await addAboutImages(aboutId, images);
};
