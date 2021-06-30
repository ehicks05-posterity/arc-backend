const { PrismaClient } = require("@prisma/client");

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
    include: { author: { select: { id: true, username: true } } },
  });
};

const createComment = async (data) => {
  return await prisma.comment.create({
    data: data,
    include: { author: { select: { id: true, username: true } } },
  });
};

const deleteComment = async (id) => {
  return await prisma.comment.delete({ where: { id: id } });
};

module.exports = {
  getAllComments,
  getComment,
  createComment,
  deleteComment,
};
