import prisma from "../prisma/client.js";

export const createTeam = (aboutId, data, photo) =>
  prisma.teamMember.create({
    data: {
      ...data,
      aboutId: aboutId,
      photo: photo?.filename || null,
    },
  });

export const getTeams = (aboutId) =>
  prisma.teamMember.findMany({ where: { aboutId: aboutId } });

export const updateTeam = (id, data, photo) =>
  prisma.teamMember.update({
    where: { id: id },
    data: {
      ...data,
      photo: photo ? photo.filename : data.photo,
    },
  });

export const deleteTeam = (id) =>
  prisma.teamMember.delete({ where: { id: id } });
