import {
  createAboutService,
  updateAboutService,
  getAboutsService,
  getAboutService,
  deleteAboutService,
  deleteAboutImageService,
  addAboutImagesService,
} from "../services/aboutService.js";

export const createAboutController = async (req, res) => {
  try {
    const { title, tagline, description, vision, mission, types } = req.body;
    const parsedTypes = JSON.parse(types);
    const images = (req.files || []).map((file, i) => ({
      ...file,
      type: Array.isArray(parsedTypes)
        ? parsedTypes[i]
        : parsedTypes || "DOKUMENTASI",
    }));

    const about = await createAboutService(
      { title, tagline, description, vision, mission },
      images
    );

    res.json(about);
  } catch (err) {
    console.error("Error creating about:", err);
    res
      .status(err.message.includes("Banner") ? 400 : 500)
      .json({ message: err.message });
  }
};

export const getAboutsController = async (req, res) => {
  try {
    const abouts = await getAboutsService();
    res.json(abouts);
  } catch (err) {
    console.error("Error fetching abouts:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAboutController = async (req, res) => {
  try {
    const about = await getAboutService(req.params.id);
    res.json(about);
  } catch (err) {
    console.error("Error fetching about:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateAboutController = async (req, res) => {
  try {
    const { title, tagline, description, vision, mission, types } = req.body;
    const parsedTypes = JSON.parse(types);
    const images = (req.files || []).map((file, i) => ({
      ...file,
      type: Array.isArray(parsedTypes)
        ? parsedTypes[i]
        : parsedTypes || "DOKUMENTASI",
    }));

    const about = await updateAboutService(
      req.params.id,
      { title, tagline, description, vision, mission },
      images
    );

    res.json(about);
  } catch (err) {
    console.error("Error updating about:", err);
    res
      .status(err.message.includes("Banner") ? 400 : 500)
      .json({ message: err.message });
  }
};

export const deleteAboutController = async (req, res) => {
  try {
    const about = await deleteAboutService(req.params.id);
    res.json({ message: "Deleted", about });
  } catch (err) {
    console.error("Error deleting about:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteAboutImageController = async (req, res) => {
  try {
    const image = await deleteAboutImageService(req.params.id);
    res.json({ message: "Deleted", image });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: err.message });
  }
};

export const addAboutImagesController = async (req, res) => {
  try {
    const { types } = req.body;
    const images = (req.files || []).map((file, i) => ({
      ...file,
      type: Array.isArray(types) ? types[i] : types || "DOKUMENTASI",
    }));

    const result = await addAboutImagesService(String(req.params.id), images);
    res.json({ message: "Images added successfully", result });
  } catch (err) {
    console.error("Error adding images:", err);
    res
      .status(err.message.includes("Banner") ? 400 : 500)
      .json({ message: err.message });
  }
};
