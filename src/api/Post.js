const {
  objectType,
  queryField,
  mutationField,
  list,
  idArg,
  enumType,
  inputObjectType,
  nonNull,
} = require("nexus");
const { Post } = require("nexus-prisma");
const { adminSeed, adminNuke } = require("./utils");

const SORTS = ["HOT", "TOP", "NEW"];
module.exports.Sort = enumType({
  name: "Sort",
  members: SORTS,
});

const COMMENT_SORTS = ["BEST", "TOP", "NEW"];
module.exports.CommentSort = enumType({
  name: "CommentSort",
  members: COMMENT_SORTS,
});

module.exports.Post = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    t.nonNull.field(Post.id);
    t.nonNull.field(Post.title);
    t.nonNull.field(Post.link);
    t.nonNull.field(Post.content);
    t.nonNull.field(Post.deleted);
    t.nonNull.field(Post.author);
    t.nonNull.string("authorId");
    t.nonNull.field(Post.comments);
    t.nonNull.list.nonNull.field("comments", {
      type: "Comment",
      args: { commentSort: "CommentSort" },
      async resolve(root, args, ctx) {
        const { commentSort } = args;
        const commentSortClause =
          commentSort === "BEST"
            ? { score: "desc" }
            : commentSort === "TOP"
            ? { score: "desc" }
            : commentSort === "NEW"
            ? { createdAt: "desc" }
            : { score: "desc" };

        return ctx.prisma.comment.findMany({
          where: { postId: root.id },
          orderBy: commentSortClause,
        });
      },
    });
    t.nonNull.int("commentCount", {
      resolve(root, _args, ctx) {
        return ctx.prisma.comment.count({
          where: { postId: root.id },
        });
      },
    });
    t.nonNull.field(Post.createdAt);
    t.nonNull.field(Post.updatedAt);
    t.nonNull.int("netVotes", {
      async resolve(root, _args, ctx) {
        const result = await ctx.prisma
          .$queryRaw`select getNetVotes(id, "createdAt") as "netVotes" from "Post" where id = ${root.id};`;
        return result[0].netVotes;
      },
    });
    t.nonNull.field(Post.score);
    t.field("userVote", {
      type: "UserPostVote",
      resolve(root, args, ctx) {
        const userId = ctx.user?.id;
        if (!userId) return null;

        return ctx.prisma.userPostVote.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: root.id,
            },
          },
        });
      },
    });
  },
});

module.exports.getPosts = queryField("getPosts", {
  type: nonNull(list(nonNull("Post"))),
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
      return ctx.prisma.$queryRaw
        `select * from "Post" order by getNetVotes(id, "createdAt") desc;`
      ;
    }
    return ctx.prisma.post.findMany({ orderBy: { score: "desc" } });
  },
});

module.exports.getPostById = queryField("getPostById", {
  type: "Post",
  args: { id: idArg() },
  resolve(_, args, ctx) {
    const { id } = args;
    return ctx.prisma.post.findUnique({ where: { id } });
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
    const authorId = ctx.user?.id;
    if (!authorId) throw new Error("Author is required");

    const { title, link, content } = args.input;
    const data = {
      author: { connect: { id: authorId } },
      title,
      link,
      content,
    };
    return ctx.prisma.post.create({ data });
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

module.exports.updatePostInput = inputObjectType({
  name: "updatePostInput",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("content");
  },
});

module.exports.updatePost = mutationField("updatePost", {
  type: "Post",
  args: { input: this.updatePostInput },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("userId is required");

    const { id, content } = args.input;

    const post = await ctx.prisma.post.findUnique({ where: { id } });
    if (post.authorId !== userId)
      throw new Error("you can only update your own posts");

    return ctx.prisma.post.update({
      where: { id },
      data: { content },
    });
  },
});

module.exports.deletePost = mutationField("deletePost", {
  type: "Post",
  args: { id: idArg() },
  async resolve(_, args, ctx) {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("userId is required");

    const { id } = args;

    const post = await ctx.prisma.post.findUnique({ where: { id } });
    if (post.authorId !== userId)
      throw new Error("you can only delete your own posts");

    return ctx.prisma.post.update({
      where: { id },
      data: {
        deleted: true,
        content: "[Deleted]",
        author: { disconnect: true },
      },
    });
  },
});
