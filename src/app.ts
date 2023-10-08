/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useJWT } from '@graphql-yoga/plugin-jwt';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache';
import prisma from './prisma';
import { schema } from './schema';

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

const yoga = createYoga({
  schema,
  context: async ({ req }: any) => {
    const user = req.auth
      ? {
          ...req.auth,
          id: req.auth.sub,
        }
      : undefined;

    return { prisma, req, user };
  },
  plugins: [
    useJWT({
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      signingKey: process.env.SUPABASE_JWT_SECRET || '',
      audience: 'authenticated',
      algorithms: ['HS256'],
    }),
    useResponseCache({
      // cache based on the authentication header
      session: request => request.headers.get('authentication'),
      ttl: 5_000,
    }),
  ],
});

const server = createServer(yoga);
server.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
