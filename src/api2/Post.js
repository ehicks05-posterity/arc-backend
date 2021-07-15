const { objectType, queryField, list, idArg } = require("nexus");
const { Post } = require("nexus-prisma");

module.exports.Post = objectType({
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
});

module.exports.getPosts = queryField("getPosts", {
  type: list("Post"),
  resolve(_, args, ctx) {
    return ctx.prisma.post.findMany();
  },
});

module.exports.getPostById = queryField("getPostById", {
  type: "Post",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.post.findUnique({ where: { id: args.id } });
  },
});
