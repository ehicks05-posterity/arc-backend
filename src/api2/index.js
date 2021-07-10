const { objectType, queryField, idArg, list } = require("nexus");
const { User, Post } = require("nexus-prisma");
const { DateTime } = require("./Datetime");

module.exports.types = {
  DateTime,
  Post: objectType({
    name: Post.$name,
    description: Post.$description,
    definition(t) {
      t.field(Post.id);
      t.field(Post.title);
      t.field(Post.content);
      t.field(Post.author);
      t.field(Post.createdAt);
      t.field(Post.updatedAt);
    },
  }),
  User: objectType({
    name: User.$name,
    description: User.$description,
    definition(t) {
      t.field(User.id);
      t.field(User.username);
      t.field(User.createdAt);
      t.field(User.updatedAt);
      t.field(User.posts);
    },
  }),
  getUser: queryField("getUser", {
    type: "User",
    args: { id: idArg() },
    resolve(_, args, ctx) {
      return ctx.prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  }),
  getPosts: queryField("getPosts", {
    type: list("Post"),
    resolve(_, args, ctx) {
      return ctx.prisma.post.findMany();
    },
  }),
};
