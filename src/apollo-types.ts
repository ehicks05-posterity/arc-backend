import { SupabaseClient, AuthUser } from '@supabase/supabase-js';

export interface ApolloContext {
  supabase: SupabaseClient<any, 'recipebook', any>;
  req: any;
  user?: AuthUser & { id: string };
}
