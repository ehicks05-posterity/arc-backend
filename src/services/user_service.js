const { PrismaClient } = require("@prisma/client");
const { getFakeUser } = require("./utils");

const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, username: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
};

const getUser = async (id) => {
  return await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      posts: { include: { author: { select: { id: true, username: true } } } },
      comments: {
        include: { author: { select: { id: true, username: true } } },
      },
    },
  });
};

const createUser = async (data) => {
  return await prisma.user.create({
    data: { ...data, author: { create: getFakeUser() } }, // todo remove fake data
    include: { author: { select: { id: true, username: true } } },
  });
};

const deleteUser = async (id) => {
  return await prisma.user.update({
    where: { id: id },
    data: {
      deleted: true,
    },
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
};
