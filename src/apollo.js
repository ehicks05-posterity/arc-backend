const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginInlineTrace } = require("apollo-server-core");
import { createClient } from "@supabase/supabase-js";
const { schema } = require("./schema");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const createApolloServer = () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        prisma,
        supabase,
        req,
        user: { ...req.user, id: req?.user?.sub },
      };
    },
    plugins: [ApolloServerPluginInlineTrace()],
  });

  return server;
};

module.exports.createApolloServer = createApolloServer;
