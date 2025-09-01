import prisma from "../prisma/client.js";

export const createAbout = async (data, images = []) => {
  const hasNewBanner = images.filter((img) => img.type === "BANNER").length;
  if (hasNewBanner > 1) {
    throw new Error("Only one BANNER allowed when creating About.");
  }

  return prisma.about.create({
    data: {
      ...data,
      images: {
        create: images.map((img) => ({
          url: img.filename,
          altText: img.originalname,
          type: img.type || "DOKUMENTASI",
        })),
      },
    },
    include: { images: true, teamMembers: true },
  });
};

export const updateAbout = async (id, data, images = []) => {
  if (images.some((img) => img.type === "BANNER")) {
    const existingBanner = await prisma.aboutImage.findFirst({
      where: { aboutId: Number(id), type: "BANNER" },
    });
    if (existingBanner) {
      throw new Error("Banner already exists for this About. Only one allowed.");
    }
  }

  return prisma.about.update({
    where: { id: Number(id) },
    data: {
      ...data,
      ...(images.length && {
        images: {
          create: images.map((img) => ({
            url: img.filename,
            altText: img.originalname,
            type: img.type || "DOKUMENTASI",
          })),
        },
      }),
    },
    include: { images: true, teamMembers: true },
  });
};


export const getAllAbout = () =>
  prisma.about.findMany({ include: { images: true, teamMembers: true } });


export const getAboutById = (id) =>
  prisma.about.findUnique({
    where: { id: Number(id) },
    include: { images: true, teamMembers: true },
  });


export const deleteAbout = (id) =>
  prisma.about.delete({
    where: { id: Number(id) },
    include: { images: true, teamMembers: true },
  });

export const deleteAboutImage = (id) =>
  prisma.aboutImage.delete({ where: { id: Number(id) } });

export const addAboutImages = async (aboutId, images) => {
  const existingBanner = await prisma.aboutImage.findFirst({
    where: { aboutId: Number(aboutId), type: "BANNER" },
  });

  const hasNewBanner = images.some((img) => img.type === "BANNER");
  if (existingBanner && hasNewBanner) {
    throw new Error("Banner already exists for this About. Only one allowed.");
  }

  return prisma.aboutImage.createMany({
    data: images.map((img) => ({
      url: img.filename,
      altText: img.originalname,
      type: img.type || "DOKUMENTASI",
      aboutId: Number(aboutId),
    })),
  });
};
