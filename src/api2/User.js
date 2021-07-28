const { objectType, queryField, mutationField, idArg, list } = require("nexus");
const { User, UserPostVote, UserCommentVote } = require("nexus-prisma");
const { getFakeUser } = require("./utils");

module.exports.User = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.username);
    t.field(User.createdAt);
    t.field(User.updatedAt);
    t.field(User.posts);
    t.field(User.comments);
    t.field(User.postVotes);
    t.field(User.commentVotes);
  },
});

module.exports.UserPostVote = objectType({
  name: UserPostVote.$name,
  description: UserPostVote.$description,
  definition(t) {
    t.field(UserPostVote.userId);
    t.field(UserPostVote.user);
    t.field(UserPostVote.postId);
    t.field(UserPostVote.post);
    t.field(UserPostVote.direction);
    t.field(UserPostVote.createdAt);
    t.field(UserPostVote.updatedAt);
  },
});

module.exports.UserCommentVote = objectType({
  name: UserCommentVote.$name,
  description: UserCommentVote.$description,
  definition(t) {
    t.field(UserCommentVote.userId);
    t.field(UserCommentVote.user);
    t.field(UserCommentVote.commentId);
    t.field(UserCommentVote.comment);
    t.field(UserCommentVote.direction);
    t.field(UserCommentVote.createdAt);
    t.field(UserCommentVote.updatedAt);
  },
});

module.exports.getUsers = queryField("getUsers", {
  type: list("User"),
  resolve(_root, _args, ctx) {
    return ctx.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
});

module.exports.getUser = queryField("getUser", {
  type: "User",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.user.findUnique({
      where: { id: args.id },
    });
  },
});

module.exports.getMe = queryField("getMe", {
  type: "User",
  resolve(_, _args, ctx) {
    const { user } = ctx;
    return ctx.prisma.user.findUnique({
      where: { id: user?.sub },
    });
  },
});

module.exports.createUser = mutationField("createUser", {
  type: "User",
  resolve(_, _args, ctx) {
    return ctx.prisma.user.create({
      data: {
        ...getFakeUser(),
      },
    });
  },
});

module.exports.deleteUser = mutationField("deleteUser", {
  type: "User",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.user.update({
      where: { id: args.id },
      data: {
        deleted: true,
      },
    });
  },
});
