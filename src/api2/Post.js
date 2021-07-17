const { objectType, queryField, mutationField, list, idArg } = require("nexus");
const { Post } = require("nexus-prisma");
const { adminCreatePost } = require("./utils");

module.exports.Post = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    t.field(Post.id);
    t.field(Post.title);
    t.field(Post.content);
    t.field(Post.author);
    t.field(Post.comments);
    t.int("commentCount", {
      resolve(root, _args, ctx) {
        return ctx.prisma.comment.count({
          where: { postId: root.id },
        });
      },
    });
    t.field(Post.createdAt);
    t.field(Post.updatedAt);
    t.field("netVotes", {
      type: "Int",
      resolve() {
        return Math.round(Math.random() * 1000);
      },
    });
    t.field(Post.score);
  },
});

module.exports.getPosts = queryField("getPosts", {
  type: list("Post"),
  resolve(_, args, ctx) {
    return ctx.prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  },
});

module.exports.getPostById = queryField("getPostById", {
  type: "Post",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.post.findUnique({ where: { id: args.id } });
  },
});

module.exports.createPost = mutationField("createPost", {
  type: "Post",
  resolve() {
    return adminCreatePost();
  },
});

module.exports.deletePost = mutationField("deletePost", {
  type: "Post",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    return ctx.prisma.post.update({
      where: { id: args.id },
      data: {
        deleted: true,
      },
    });
  },
});
