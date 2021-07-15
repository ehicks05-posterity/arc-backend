const { objectType, queryField, list } = require("nexus");
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
