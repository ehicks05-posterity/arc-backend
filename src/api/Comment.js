import {
  objectType,
  queryField,
  mutationField,
  list,
  idArg,
  inputObjectType,
} from 'nexus';
import { Comment } from 'nexus-prisma';

const _Comment = objectType({
  name: Comment.$name,
  description: Comment.$description,
  definition(t) {
    t.nonNull.field(Comment.id);
    t.nonNull.field(Comment.content);
    t.nonNull.field(Comment.deleted);
    t.nonNull.field(Comment.level);
    t.nonNull.field(Comment.author);
    t.nonNull.field(Comment.authorId);
    t.nonNull.field(Comment.post);
    t.nonNull.field(Comment.postId);
    t.field(Comment.parentComment);
    t.field(Comment.parentCommentId);
    t.nonNull.field(Comment.comments);
    t.nonNull.field(Comment.score);
    t.nonNull.field(Comment.createdAt);
    t.nonNull.field(Comment.updatedAt);
    t.nonNull.int('netVotes', {
      async resolve(root, _args, ctx) {
        const result = await ctx.prisma
          .$queryRaw`select getCommentNetVotes(id, "createdAt") as "netVotes" from "Comment" where id = ${root.id};`;
        return result[0].netVotes;
      },
    });
    t.field('userVote', {
      type: 'UserCommentVote',
      resolve(root, args, ctx) {
        const userId = ctx.user?.id;
        if (!userId) return null;

        return ctx.prisma.userCommentVote.findUnique({
          where: {
            userId_commentId: {
              userId,
              commentId: root.id,
            },
          },
        });
      },
    });
  },
});
export { _Comment as Comment };

export const getComments = queryField('getComments', {
  type: list('Comment'),
  resolve(_, args, ctx) {
    return ctx.prisma.comment.findMany({ orderBy: { createdAt: 'desc' } });
  },
});

export const getCommentById = queryField('getCommentById', {
  type: 'Comment',
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.comment.findUnique({ where: { id: args.id } });
  },
});

export const createCommentInput = inputObjectType({
  name: 'createCommentInput',
  definition(t) {
    t.nonNull.string('postId');
    t.string('parentCommentId');
    t.int('level');
    t.string('content');
  },
});

export const createComment = mutationField('createComment', {
  type: 'Comment',
  args: { input: this.createCommentInput },
  resolve(_, args, ctx) {
    const authorId = ctx.user?.id;
    if (!authorId) throw new Error('Author is required');

    const { postId, parentCommentId, level, content } = args.input;
    const data = {
      author: { connect: { id: authorId } },
      post: { connect: { id: postId } },
      parentComment: parentCommentId
        ? { connect: { id: parentCommentId } }
        : undefined,
      level,
      content,
    };
    return ctx.prisma.comment.create({ data });
  },
});

export const updateCommentInput = inputObjectType({
  name: 'updateCommentInput',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('content');
  },
});

export const updateComment = mutationField('updateComment', {
  type: 'Comment',
  args: { input: this.updateCommentInput },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.id;
    if (!userId) throw new Error('userId is required');

    const { id, content } = args.input;

    const comment = await ctx.prisma.comment.findUnique({ where: { id } });
    if (comment.authorId !== userId)
      throw new Error('you can only update your own comments');

    return ctx.prisma.comment.update({
      where: { id },
      data: { content },
    });
  },
});

export const deleteComment = mutationField('deleteComment', {
  type: 'Comment',
  args: { id: idArg() },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.id;
    if (!userId) throw new Error('userId is required');

    const { id } = args;

    const comment = await ctx.prisma.comment.findUnique({ where: { id } });
    if (comment.authorId !== userId)
      throw new Error('you can only delete your own comments');

    return ctx.prisma.comment.update({
      where: { id },
      data: {
        deleted: true,
        content: '[Deleted]',
        author: { disconnect: true },
      },
    });
  },
});
