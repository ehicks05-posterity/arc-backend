import { ApolloServer } from '@apollo/server';
import { schema } from './schema';
import { ApolloContext } from './apollo-types';

const createApolloServer = () => {
  const server = new ApolloServer<ApolloContext>({
    schema,
    plugins: [],
    formatError: err => {
      console.error(err);
      return err;
    },
  });

  return server;
};

export { createApolloServer };
