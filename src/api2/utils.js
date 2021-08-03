const _ = require("lodash");
const faker = require("faker");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const getFakeUser = () => ({
  username: faker.internet.userName(),
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

const adminNuke = async () => {
  await prisma.userPostVote.deleteMany();
  await prisma.userCommentVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
};

const POST_COUNT = 10;
const USER_COUNT = 1000;
const COMMENTS_PER_POST = 10;
const MAX_VOTES_PER_POST = USER_COUNT;
const VOTES_PER_COMMENT = 10;

const adminSeed = async () => {
  // create users
  console.log("creating users...");
  const usersData = [...Array(USER_COUNT)].map(() => getFakeUser());
  await prisma.user.createMany({ data: usersData });
  const users = await prisma.user.findMany();

  // create posts
  console.log("creating posts...");
  const postsData = [...Array(POST_COUNT)].map(() => ({
    ...getFakePost(),
    authorId: sample(users).id,
  }));
  await prisma.post.createMany({
    data: postsData,
  });
  const posts = await prisma.post.findMany();

  // for each post, create comments
  console.log("creating comments...");
  const postCommentsPromises = posts.map(async (p) => {
    const comments = [];
    // create 10 comments
    while (comments.length < COMMENTS_PER_POST) {
      // aim for 25% to be roots, 75% to be children
      const isChild = comments.length > 0 && Math.random() > 0.25;
      const parent = isChild ? sample(comments) : undefined;
      const comment = await prisma.comment.create({
        data: {
          ...getFakeComment(),
          post: { connect: { id: p.id } },
          author: { connect: { id: sample(users).id } },
          parentComment: { connect: parent ? { id: parent.id } : undefined },
          level: parent ? parent.level + 1 : 0,
        },
      });
      comments.push(comment);
    }
  });
  await Promise.all(postCommentsPromises);

  // for each post, create votes
  console.log("creating userPostVotes...");
  const userPostVotePromises = posts.map(async (p) => {
    const UPVOTE_RATIO_FOR_POST = Math.random() / 2 + 0.5; // targeting 0.5-1.0
    const userPostVotePerPostPromises = _.sampleSize(
      users,
      Math.random() * MAX_VOTES_PER_POST
    ).map(async (u) => {
      await prisma.userPostVote.create({
        data: {
          post: { connect: { id: p.id } },
          user: { connect: { id: u.id } },
          direction: Math.random() <= UPVOTE_RATIO_FOR_POST ? 1 : -1,
        },
      });
    });
    await Promise.all(userPostVotePerPostPromises);
  });
  await Promise.all(userPostVotePromises);

  // for each comment, create votes
  console.log("creating userCommentVotes...");
  const comments = await prisma.comment.findMany();
  const userCommentVotePromises = comments.map(async (c) => {
    const userCommentVotePerCommentPromises = _.sampleSize(
      users,
      VOTES_PER_COMMENT
    ).map(async (u) => {
      await prisma.userCommentVote.create({
        data: {
          comment: { connect: { id: c.id } },
          user: { connect: { id: u.id } },
          direction: Math.random() >= 0.25 ? 1 : -1,
        },
      });
    });
    await Promise.all(userCommentVotePerCommentPromises);
  });
  await Promise.all(userCommentVotePromises);

  await prisma.$executeRaw("call updatescore();");

  return prisma.post.findMany();
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

  // todo grab users and randomly vote

  return await prisma.post.findUnique({ where: { id: post.id } });
};

module.exports = {
  adminSeed,
  adminNuke,
  adminCreatePost,
  getFakeUser,
  getFakePost,
  getFakeComment,
  getFakeComments,
};
