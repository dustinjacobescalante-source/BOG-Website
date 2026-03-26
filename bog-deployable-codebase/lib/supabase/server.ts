import { createServerClient } from '@supabase/ssr';

type CookieItem = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

type CookieStoreLike = {
  getAll?: () => { name: string; value: string }[];
  setAll?: (cookies: CookieItem[]) => void;
};

export function createClient(cookieStore?: CookieStoreLike) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll?.() ?? [];
        },
        setAll: (cookiesToSet: CookieItem[]) => {
          cookieStore?.setAll?.(cookiesToSet);
        },
      },
    }
  );
}
