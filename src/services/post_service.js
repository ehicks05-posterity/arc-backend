const { PrismaClient } = require("@prisma/client");

const { getFakeUser, getFakePost, getFakeComments } = require("./utils");

const prisma = new PrismaClient();

const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      comments: {
        include: { author: { select: { id: true, username: true } } },
      },
      author: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
};

const getPost = async (id) => {
  return await prisma.post.findUnique({
    where: { id: id },
    include: {
      comments: true,
      author: { select: { id: true, username: true } },
    },
  });
};

const createPost = async (data) => {
  return await prisma.post.create({
    data: data,
    include: {
      comments: true,
      author: { select: { id: true, username: true } },
    },
  });
};

const deletePost = async (id) => {
  await prisma.comment.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id: id } });

  return;
};

const adminCreatePost = async () => {
  const post = await prisma.post.create({
    data: {
      ...getFakePost(),
      comments: {
        create: [
          ...getFakeComments().map((comment) => ({
            ...comment,
            author: { create: getFakeUser() },
          })),
        ],
      },
      author: { create: getFakeUser() },
    },
    include: { comments: true, author: true },
  });

  await prisma.comment.update({
    where: { id: post.comments[0].id },
    data: {
      parentCommentId: post.comments[1].id,
      level: post.comments[0].level + 1,
    },
  });

  return await prisma.post.findUnique({ where: { id: post.id } });
};

const adminDeleteEverything = async () => {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  return;
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  deletePost,
  adminCreatePost,
  adminDeleteEverything,
};
