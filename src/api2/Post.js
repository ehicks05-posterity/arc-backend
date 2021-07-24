const {
  objectType,
  queryField,
  mutationField,
  list,
  idArg,
  enumType,
  inputObjectType,
} = require("nexus");
const { Post } = require("nexus-prisma");
const { adminCreatePost, adminSeed, adminNuke } = require("./utils");

module.exports.Post = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    t.field(Post.id);
    t.field(Post.title);
    t.field(Post.link);
    t.field(Post.content);
    t.field(Post.author);
    t.string("authorId");
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

module.exports.createPostInput = inputObjectType({
  name: "createPostInput",
  definition(t) {
    t.nonNull.string("title");
    t.string("link");
    t.string("content");
  },
});

module.exports.createPost = mutationField("createPost", {
  type: "Post",
  args: { input: this.createPostInput },
  resolve(_, args, ctx) {
    const { title, link, content } = args;
    const authorId = "";
    const data = {
      author: { connect: { id: authorId } },
      title,
      link,
      content,
    };
    return ctx.prisma.post.create({ data });
  },
});

module.exports.adminCreatePost = mutationField("adminCreatePost", {
  type: "Post",
  resolve() {
    return adminCreatePost();
  },
});

module.exports.adminSeed = mutationField("adminSeed", {
  type: list("Post"),
  resolve() {
    return adminSeed();
  },
});

module.exports.adminNuke = mutationField("adminNuke", {
  type: "Post",
  resolve() {
    return adminNuke();
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
