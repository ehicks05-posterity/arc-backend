const { ApolloServer } = require("apollo-server");
const { schema } = require("./schema");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const server = new ApolloServer({
  schema,
  context: () => {
    return {
      prisma,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
