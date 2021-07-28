const {
  objectType,
  queryField,
  mutationField,
  list,
  idArg,
  inputObjectType,
} = require("nexus");
const { Comment } = require("nexus-prisma");

module.exports.Comment = objectType({
  name: Comment.$name,
  description: Comment.$description,
  definition(t) {
    t.field(Comment.id);
    t.field(Comment.content);
    t.field(Comment.deleted);
    t.field(Comment.level);
    t.field(Comment.author);
    t.string("authorId");
    t.field(Comment.post);
    t.nonNull.string("postId");
    t.field(Comment.parentComment);
    t.string("parentCommentId");
    t.field(Comment.comments);
    t.field(Comment.score);
    t.field(Comment.createdAt);
    t.field(Comment.updatedAt);
  },
});

module.exports.getComments = queryField("getComments", {
  type: list("Comment"),
  resolve(_, args, ctx) {
    return ctx.prisma.comment.findMany({ orderBy: { createdAt: "desc" } });
  },
});

module.exports.getCommentById = queryField("getCommentById", {
  type: "Comment",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.comment.findUnique({ where: { id: args.id } });
  },
});

module.exports.createCommentInput = inputObjectType({
  name: "createCommentInput",
  definition(t) {
    t.nonNull.string("postId");
    t.string("parentCommentId");
    t.int("level");
    t.string("content");
  },
});

module.exports.createComment = mutationField("createComment", {
  type: "Comment",
  args: { input: this.createCommentInput },
  resolve(_, args, ctx) {
    const authorId = ctx.user.sub;
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

module.exports.deleteComment = mutationField("deleteComment", {
  type: "Comment",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.comment.update({
      where: { id: args.id },
      data: {
        deleted: true,
        content: "Deleted",
        author: { disconnect: true },
      },
    });
  },
});
