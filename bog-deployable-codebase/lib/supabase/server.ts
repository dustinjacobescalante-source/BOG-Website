import { createServerClient } from '@supabase/ssr';

export function createClient(cookieStore?: {
  getAll?: () => { name: string; value: string }[];
  setAll?: (
    cookies: { name: string; value: string; options?: Record<string, unknown> }[]
  ) => void;
}) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll?.() ?? [];
        },
        setAll(cookiesToSet) {
          cookieStore?.setAll?.(cookiesToSet);
        },
      },
    }
  );
}
