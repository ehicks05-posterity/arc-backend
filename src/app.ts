/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useJWT } from '@graphql-yoga/plugin-jwt';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache';
import { JwtPayload, verify } from 'jsonwebtoken';
import { schema } from './schema';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

const decodeToken = (request: Request): JwtPayload | null => {
  const header = request.headers.get('authorization');
  if (header !== null) {
    const token = header.split(' ')[1];
    const tokenPayload = verify(token, JWT_SECRET) as JwtPayload;
    return tokenPayload;
  }

  return null;
};

const yoga = createYoga({
  schema,
  context: async ({ request }: { request: Request }) => {
    const token = decodeToken(request);
    const user = token ? { ...token, id: token.sub } : undefined;
    const userId = user?.id;

    return { request, user, userId };
  },
  plugins: [
    useJWT({
      issuer: `https://${process.env.SUPABASE_URL}/auth/v1`,
      signingKey: JWT_SECRET,
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
