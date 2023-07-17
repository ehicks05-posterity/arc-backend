import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { schema } from './schema';
import prisma from './prisma';
import { supabase } from './supabase';

const createApolloServer = () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => {
      const user = req.auth
        ? {
            ...req.auth,
            id: req.auth.sub,
          }
        : undefined;

      return {
        prisma,
        supabase,
        req,
        user,
      };
    },
    plugins: [ApolloServerPluginInlineTrace()],
  });

  return server;
};

const _createApolloServer = createApolloServer;
export { _createApolloServer as createApolloServer };
