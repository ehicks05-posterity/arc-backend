const { objectType, queryField, idArg } = require("nexus");
const { User } = require("nexus-prisma");

module.exports.User = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.username);
    t.field(User.createdAt);
    t.field(User.updatedAt);
    t.field(User.posts);
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
