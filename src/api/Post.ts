import {
  objectType,
  queryField,
  mutationField,
  list,
  idArg,
  enumType,
  inputObjectType,
  arg,
  nonNull,
  intArg,
} from 'nexus';
import { Prisma } from '@prisma/client';
import { Post, PostScore } from 'nexus-prisma';
import { adminSeed as _adminSeed, adminNuke as _adminNuke } from './utils';
import prisma from '../prisma';

const SORTS = ['HOT', 'TOP', 'NEW'] as const;
export const Sort = enumType({
  name: 'Sort',
  members: SORTS,
});

const COMMENT_SORTS = ['BEST', 'TOP', 'NEW'];
export const CommentSort = enumType({
  name: 'CommentSort',
  members: COMMENT_SORTS,
});

const _PostScore = objectType({
  name: PostScore.$name,
  description: PostScore.$description,
  definition(t) {
    t.nonNull.field(PostScore.id);
    t.nonNull.field(PostScore.postId);
    t.nonNull.field(PostScore.post);
    t.nonNull.field(PostScore.score);
  },
});
export { _PostScore as PostScore };

const _Post = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    t.nonNull.field(Post.id);
    t.nonNull.field(Post.title);
    t.nonNull.field(Post.link);
    t.nonNull.field(Post.content);
    t.nonNull.field(Post.deleted);
    t.field(Post.author);
    t.field(Post.authorId);
    t.nonNull.field(Post.comments);
    t.nonNull.list.nonNull.field('comments', {
      type: 'Comment',
      args: { commentSort: 'CommentSort' },
      async resolve(root, args) {
        const { commentSort } = args;
        const commentSortClause: Prisma.Enumerable<Prisma.CommentOrderByWithRelationInput> =
          commentSort === 'BEST'
            ? { commentScore: { score: 'desc' } }
            : commentSort === 'TOP'
            ? { netVotes: 'desc' }
            : commentSort === 'NEW'
            ? { createdAt: 'desc' }
            : { commentScore: { score: 'desc' } };

        return prisma.comment.findMany({
          where: { postId: root.id },
          orderBy: commentSortClause,
        });
      },
    });
    t.nonNull.int('commentCount', {
      resolve(root, _args, ctx) {
        return ctx.prisma.comment.count({
          where: { postId: root.id },
        });
      },
    });
    t.nonNull.field(Post.createdAt);
    t.nonNull.field(Post.updatedAt);
    t.nonNull.int('netVotes', {
      async resolve(root, _args, ctx) {
        const result = await ctx.prisma
          .$queryRaw`select getNetVotes(id) as "netVotes" from "post" where id = ${root.id};`;
        return result[0].netVotes;
      },
    });
    t.nonNull.float('score', {
      async resolve(root) {
        const result = await prisma.postScore.findUnique({
          where: { postId: root.id },
        });
        return result?.score || 0;
      },
    });
    t.field('userVote', {
      type: 'UserPostVote',
      resolve(root, args, ctx) {
        const userId = ctx.user?.id;
        if (!userId) return null;

        return ctx.prisma.userPostVote.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: root.id,
            },
          },
        });
      },
    });
  },
});
export { _Post as Post };

// TODO: these are types & constants for POSTS query, consider breaking out
type SortKey = (typeof SORTS)[number];

const sortToOrderByClause: Record<
  SortKey,
  Prisma.Enumerable<Prisma.PostOrderByWithRelationInput>
> = {
  HOT: { postScore: { score: 'desc' } },
  TOP: { netVotes: 'desc' },
  NEW: { createdAt: 'desc' },
};

const PAGE_SIZE = 10;

export const getPosts = queryField('getPosts', {
  type: nonNull(list(nonNull('Post'))),
  args: {
    sort: arg({ type: 'Sort', default: 'HOT' }),
    offset: intArg(),
  },
  resolve(_, args) {
    const { sort, offset } = args;
    const skip = offset || 0;

    const orderBy = sortToOrderByClause[sort || 'HOT'];

    return prisma.post.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy,
    });
  },
});

export const getPostById = queryField('getPostById', {
  type: 'Post',
  args: { id: idArg() },
  resolve(_, args, ctx) {
    const { id } = args;
    return ctx.prisma.post.findUnique({ where: { id } });
  },
});

export const createPostInput = inputObjectType({
  name: 'createPostInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('link');
    t.nonNull.string('content');
  },
});

export const createPost = mutationField('createPost', {
  type: 'Post',
  args: { input: nonNull(createPostInput) },
  async resolve(_, args, ctx) {
    const authorId = ctx.user?.id;
    if (!authorId) throw new Error('Author is required');

    const { title, link, content } = args.input;
    const data = {
      author: { connect: { id: authorId } },
      title,
      link,
      content,
    };
    const post = await prisma.post.create({ data });
    await prisma.postScore.create({ data: { postId: post.id, score: 0 } });
    return post;
  },
});

export const adminSeed = mutationField('adminSeed', {
  type: 'String',
  async resolve() {
    await _adminSeed();
    return 'ok';
  },
});

export const adminNuke = mutationField('adminNuke', {
  type: 'String',
  async resolve() {
    await _adminNuke();
    return 'ok';
  },
});

export const updatePostInput = inputObjectType({
  name: 'updatePostInput',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('content');
  },
});

export const updatePost = mutationField('updatePost', {
  type: 'Post',
  args: { input: nonNull(updatePostInput) },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.id;
    if (!userId) throw new Error('userId is required');

    const { id, content } = args.input;

    const post = await ctx.prisma.post.findUnique({ where: { id } });
    if (post.authorId !== userId)
      throw new Error('you can only update your own posts');

    return ctx.prisma.post.update({
      where: { id },
      data: { content },
    });
  },
});

export const deletePost = mutationField('deletePost', {
  type: 'Post',
  args: { id: idArg() },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.id;
    if (!userId) throw new Error('userId is required');

    const { id } = args;

    const post = await ctx.prisma.post.findUnique({ where: { id } });
    if (post.authorId !== userId)
      throw new Error('you can only delete your own posts');

    return ctx.prisma.post.update({
      where: { id },
      data: {
        deleted: true,
        content: '[Deleted]',
        author: { disconnect: true },
      },
    });
  },
});
