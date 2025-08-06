import prisma from '../prisma/client.js';

export const findByUsername = async (username) => {
  return await prisma.admin.findUnique({ where: { username } });
};

export const create = async (username, hashedPassword) => {
  return await prisma.admin.create({
    data: { username, password: hashedPassword }
  });
};
