import { SupabaseClient, AuthUser } from '@supabase/supabase-js';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime';

export interface ApolloContext {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined,
    DefaultArgs
  >;
  supabase: SupabaseClient<any, 'recipebook', any>;
  req: any;
  user?: AuthUser & { id: string };
}
