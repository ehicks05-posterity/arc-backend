const { PrismaClient } = require("@prisma/client");
const { getFakeUser } = require("./utils");

const prisma = new PrismaClient();

const getAllComments = async () => {
  return await prisma.comment.findMany({
    include: { author: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
};

const getComment = async (id) => {
  return await prisma.comment.findUnique({
    where: { id: id },
    include: {
      author: { select: { id: true, username: true } },
      comments: { include: { comments: true } },
    },
  });
};

const createComment = async (data) => {
  return await prisma.comment.create({
    data: { ...data, author: { create: getFakeUser() } }, // todo remove fake data
    include: { author: { select: { id: true, username: true } } },
  });
};

const softDeleteComment = async (id) => {
  return await prisma.comment.update({
    where: { id: id },
    data: {
      deleted: true,
      content: "Deleted",
      author: { disconnect: true },
    },
  });
};

module.exports = {
  getAllComments,
  getComment,
  createComment,
  softDeleteComment,
};
