import { sample, sampleSize } from 'lodash';
import { faker } from '@faker-js/faker';
import prisma from '../prisma';

export const adminNuke = async () => {
  await prisma.userPostVote.deleteMany();
  await prisma.userCommentVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
};

const POST_COUNT = 80;
const USER_COUNT = 100;
const MAX_COMMENTS_PER_POST = 50;
const MAX_VOTES_PER_POST = USER_COUNT;
const MAX_VOTES_PER_COMMENT = USER_COUNT / 10;

export const adminSeed = async () => {
  console.log('creating users...');
  await prisma.user.createMany({
    data: [...Array(USER_COUNT)].map(() => {
      const username = faker.internet.userName();
      return {
        id: username,
        username,
      };
    }),
  });
  const users = await prisma.user.findMany();

  console.log('creating posts...');
  await prisma.post.createMany({
    data: [...Array(POST_COUNT)].map(() => ({
      title: faker.hacker.phrase(),
      content: faker.lorem.paragraphs(),
      link: 'https://www.google.com',
      authorId: sample(users).id,
    })),
  });
  const posts = await prisma.post.findMany();

  console.log('for each post, creating comments...');
  const commentPromises = posts.map(async p => {
    const comments = [];
    const commentCount = Math.random() * MAX_COMMENTS_PER_POST;
    while (comments.length < commentCount) {
      // aim for 25% to be roots, 75% to be children
      const isChild = comments.length > 0 && Math.random() > 0.25;
      const parent = isChild ? sample(comments) : undefined;
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.paragraphs(Math.round(Math.random() * 10)),
          postId: p.id,
          authorId: sample(users).id,
          parentCommentId: parent?.id,
          level: parent ? parent.level + 1 : 0,
        },
      });
      comments.push(comment);
    }
  });
  await Promise.all(commentPromises);
  const comments = await prisma.comment.findMany();

  const UPVOTE_RATIO = Math.random() / 2 + 0.5; // targeting 0.5-1.0

  console.log('for each post, creating userPostVotes...');
  const userPostVoteData = posts
    .map(p => {
      const voters = sampleSize(users, Math.random() * MAX_VOTES_PER_POST);
      return voters.map(u => ({
        postId: p.id,
        userId: u.id,
        direction: Math.random() <= UPVOTE_RATIO ? 1 : -1,
      }));
    })
    .flat();
  await prisma.userPostVote.createMany({ data: userPostVoteData });

  console.log('for each comment, creating userCommentVotes...');
  const userCommentVoteData = comments
    .map(c => {
      const voters = sampleSize(users, Math.random() * MAX_VOTES_PER_COMMENT);
      return voters.map(u => ({
        commentId: c.id,
        userId: u.id,
        direction: Math.random() <= UPVOTE_RATIO ? 1 : -1,
      }));
    })
    .flat();
  await prisma.userCommentVote.createMany({ data: userCommentVoteData });

  await prisma.$executeRaw`call updatescore();`;
  return prisma.post.findMany();
};
