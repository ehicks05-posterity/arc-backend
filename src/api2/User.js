const {
  objectType,
  queryField,
  mutationField,
  idArg,
  list,
  inputObjectType,
  enumType,
} = require("nexus");
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

const DIRECTIONS = ["UP", "DOWN"];
const DIRECTION_TO_VALUE = { UP: 1, DOWN: -1 };

module.exports.Direction = enumType({
  name: "Direction",
  members: DIRECTIONS,
});

module.exports.createUserPostVoteInput = inputObjectType({
  name: "createUserPostVoteInput",
  definition(t) {
    t.string("postId");
    t.nonNull.field("direction", { type: "Direction" });
  },
});

module.exports.createUserPostVote = mutationField("createUserPostVote", {
  type: "UserPostVote",
  args: { input: this.createUserPostVoteInput },
  resolve(_, args, ctx) {
    const userId = ctx.user?.sub;
    if (!userId) throw new Error("userId is required");

    const { postId, direction: directionArg } = args.input;
    const direction = DIRECTION_TO_VALUE[directionArg];

    return ctx.prisma.userPostVote.upsert({
      where: { userId_postId: { userId, postId } },
      update: { direction },
      create: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
        direction,
      },
    });
  },
});

module.exports.deleteUserPostVote = mutationField("deleteUserPostVote", {
  type: "UserPostVote",
  args: { postId: idArg() },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.sub;
    if (!userId) throw new Error("userId is required");

    const query = {
      where: { userId_postId: { userId, postId: args.postId } },
    };

    const userPostVote = await ctx.prisma.userPostVote.findUnique(query);
    if (userPostVote) return ctx.prisma.userPostVote.delete(query);
  },
});

module.exports.createUserCommentVoteInput = inputObjectType({
  name: "createUserCommentVoteInput",
  definition(t) {
    t.string("commentId");
    t.nonNull.field("direction", { type: "Direction" });
  },
});

module.exports.createUserCommentVote = mutationField("createUserCommentVote", {
  type: "UserCommentVote",
  args: { input: this.createUserCommentVoteInput },
  resolve(_, args, ctx) {
    const userId = ctx.user?.sub;
    if (!userId) throw new Error("userId is required");

    const { commentId, direction: directionArg } = args.input;
    const direction = DIRECTION_TO_VALUE[directionArg];

    return ctx.prisma.userCommentVote.upsert({
      where: { userId_commentId: { userId, commentId } },
      update: { direction },
      create: {
        user: { connect: { id: userId } },
        comment: { connect: { id: commentId } },
        direction,
      },
    });
  },
});

module.exports.deleteUserCommentVote = mutationField("deleteUserCommentVote", {
  type: "UserCommentVote",
  args: { commentId: idArg() },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.sub;
    if (!userId) throw new Error("userId is required");

    const query = {
      where: { userId_commentId: { userId, commentId: args.commentId } },
    };

    const userCommentVote = await ctx.prisma.userCommentVote.findUnique(query);
    if (userCommentVote) return ctx.prisma.userCommentVote.delete(query);
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
