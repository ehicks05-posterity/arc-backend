import { makeSchema } from 'nexus';
import { types } from './api/index';

export const schema = makeSchema({
  outputs: {
    schema: `${__dirname}/generated/schema.graphql`,
    typegen: `${__dirname}/generated/nexus.ts`,
  },
  types,
});
