const { PrismaClient } = require("@prisma/client");

const { getFakeUser, getFakePost, getFakeComments } = require("./utils");

const prisma = new PrismaClient();

const findAllPosts = async () => {
  return await prisma.post.findMany({
    include: { comments: true, author: true },
  });
};

const deleteAllPosts = async () => {
  const posts = await prisma.post.findMany();

  await Promise.all(
    posts.map(async (post) => {
      await prisma.comment.deleteMany({ where: { postId: post.id } });
    })
  );

  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  return;
};

const createPost = async () => {
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
    data: { parentCommentId: post.comments[1].id },
  });

  return await prisma.post.findUnique({ where: { id: post.id } });
};

module.exports = {
  findAllPosts,
  deleteAllPosts,
  createPost,
};
