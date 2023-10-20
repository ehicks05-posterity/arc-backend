import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
// import TracingPlugin, { isRootField } from '@pothos/plugin-tracing';
// import { createNewrelicWrapper } from '@pothos/tracing-newrelic';
import prisma from './prisma';

// const wrapResolver = createNewrelicWrapper({
//   includeArgs: true,
//   includeSource: true,
// });

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: { req: Request; user?: { id: string }; userId?: string };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [
    // TracingPlugin,
    PrismaPlugin,
    PrismaUtils,
  ],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
  },
  // tracing: {
  //   default: config => isRootField(config),
  //   wrap: resolver => wrapResolver(resolver),
  // },
});

export { builder };
