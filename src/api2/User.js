const { objectType, queryField, mutationField, idArg, list } = require("nexus");
const { User } = require("nexus-prisma");
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
