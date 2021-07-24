const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginInlineTrace } = require("apollo-server-core");
const { schema } = require("./schema");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createApolloServer = () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        prisma,
        req,
        user: req.user,
      };
    },
    plugins: [ApolloServerPluginInlineTrace()],
  });

  return server;
};

module.exports.createApolloServer = createApolloServer;
