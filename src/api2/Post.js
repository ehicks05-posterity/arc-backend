const {
  objectType,
  queryField,
  mutationField,
  list,
  idArg,
  enumType,
} = require("nexus");
const { Post } = require("nexus-prisma");
const { adminCreatePost } = require("./utils");

module.exports.Post = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    t.field(Post.id);
    t.field(Post.title);
    t.field(Post.link);
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
    t.field(Post.netVotes);
    t.field(Post.score);
  },
});

module.exports.Sort = enumType({
  name: "Sort",
  members: ["HOT", "TOP", "NEW"],
});

const sortOptionToQuery = {
  HOT: { orderBy: { score: "desc" } },
  TOP: { orderBy: { netVotes: "desc" } },
  NEW: { orderBy: { createdAt: "desc" } },
};

module.exports.getPosts = queryField("getPosts", {
  type: list("Post"),
  args: { sort: "Sort" },
  resolve(_, args, ctx) {
    const query = sortOptionToQuery[args.sort];
    return ctx.prisma.post.findMany(query);
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
