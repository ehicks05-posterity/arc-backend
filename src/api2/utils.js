const faker = require("faker");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

  // todo grab users and randomly vote

  return await prisma.post.findUnique({ where: { id: post.id } });
};

const getFakeUser = () => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  role: faker.datatype.string(),
});

const getFakePost = () => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(),
  link: "https://www.google.com",
});

const getFakeComment = () => {
  return {
    content: faker.lorem.paragraphs(),
  };
};

const getFakeComments = () => {
  return [...Array(3)].map(() => getFakeComment());
};

module.exports = {
  adminCreatePost,
  getFakeUser,
  getFakePost,
  getFakeComment,
  getFakeComments,
};
