import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { createClient } from '@supabase/supabase-js';
import { schema } from './schema';
import prisma from './prisma';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

const createApolloServer = () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => {
      console.log({ auth: req.auth });
      const user = req.auth
        ? {
            ...req.auth,
            id: req.auth.app_metadata.username,
            authId: req.auth.sub,
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
