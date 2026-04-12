import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to handle build-time when env vars may not be available
let _supabaseInstance: SupabaseClient | null = null;

function getOrCreateClient(): SupabaseClient {
  if (_supabaseInstance) {
    return _supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build, return a mock client that throws helpful errors at runtime
    throw new Error(
      "Supabase client accessed before environment variables were available. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  _supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _supabaseInstance;
}

// Export a getter object that lazily creates the client on first use
// This allows the module to be imported during build without crashing
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getOrCreateClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

// Export a function to create new client instances (for client components)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
