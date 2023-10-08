/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import morgan from 'morgan';
import express, { urlencoded, json } from 'express';
import http from 'http';
import cors from 'cors';
import { expressjwt as jwt } from 'express-jwt';
import { expressMiddleware } from '@apollo/server/express4';
import { createApolloServer } from './apollo';
import prisma from './prisma';

const app = express();
const httpServer = http.createServer(app);
app.use(cors({ origin: ['https://arc.ehicks.net', 'http://localhost:3000'] }));

// AUTH
const checkJwt = jwt({
  secret: process.env.SUPABASE_JWT_SECRET || '',
  credentialsRequired: false,
  audience: 'authenticated',
  algorithms: ['HS256'],
});

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));
// parse application/json
app.use(json());
// completely disable cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => {
  res.send('See you at the party Richter!');
});
app.get('/test', checkJwt, async (req, res) => {
  const { user } = req;
  if (!user) {
    res.send('not authenticated');
    return;
  }

  res.send('authenticated');
});

app.get('/me', checkJwt, async (req, res) => {
  const authUser =
    await prisma.$executeRaw`select * from auth.users where id = ${req?.user?.id};`;
  res.json({
    message: 'Hello! This is an authenticated route.',
    user: req.user,
    authUser,
  });
});

app.use(checkJwt, async (req, res, next) => {
  const username = req.user?.app_metadata?.username;
  if (username) {
    const user = await prisma.user.findUnique({ where: { id: username } });
    if (!user) {
      console.log(req.user);
      console.log(
        `incoming user ${username} is missing from public.users. creating...`,
      );
      await prisma.user.create({ data: { id: username, username: '' } });
    }
  }
  next();
});

app.use('/graphql', checkJwt);

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;
const path = 'graphql';
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

const init = async () => {
  const server = createApolloServer();
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }: any) => {
        const user = req.auth
          ? {
              ...req.auth,
              id: req.auth.sub,
            }
          : undefined;

        return { prisma, req, user };
      },
    }),
  );

  await new Promise<void>(resolve => {
    httpServer.listen({ port }, resolve);
  });
  console.log(`🚀 Server ready at http://localhost:${port}/${path}`);
};

init();
