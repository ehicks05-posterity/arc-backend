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
    t.nonNull.int("netVotes", {
      async resolve(root, _args, ctx) {
        const result = await ctx.prisma
          .$queryRaw`select getNetVotes(id, "createdAt") as "netVotes" from "Post" where id = ${root.id};`;
        return result[0].netVotes;
      },
    });
    t.field(Post.score);
  },
});

const SORTS = ["HOT", "TOP", "NEW"];

module.exports.Sort = enumType({
  name: "Sort",
  members: SORTS,
});

module.exports.getPosts = queryField("getPosts", {
  type: list("Post"),
  args: { sort: "Sort" },
  resolve(_, args, ctx) {
    const { sort } = args;
    if (sort === "HOT") {
      return ctx.prisma.post.findMany({ orderBy: { score: "desc" } });
    }
    if (sort === "NEW") {
      return ctx.prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    }
    if (sort === "TOP") {
      return ctx.prisma.$queryRaw(
        'select * from "Post" order by getNetVotes(id, "createdAt") desc;'
      );
    }
    return ctx.prisma.post.findMany({ orderBy: { score: "desc" } });
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
