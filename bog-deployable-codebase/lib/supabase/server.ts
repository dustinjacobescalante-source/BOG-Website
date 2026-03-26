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

export async function createClient(cookieStore?: CookieStoreLike) {
  let resolvedCookieStore = cookieStore;

  if (!resolvedCookieStore) {
    try {
      const { cookies } = await import('next/headers');
      const nextCookieStore = await cookies();

      resolvedCookieStore = {
        getAll: () => nextCookieStore.getAll(),
        setAll: () => {},
      };
    } catch {
      resolvedCookieStore = {
        getAll: () => [],
        setAll: () => {},
      };
    }
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return resolvedCookieStore?.getAll?.() ?? [];
        },
        setAll(cookiesToSet: CookieItem[]) {
          resolvedCookieStore?.setAll?.(cookiesToSet);
        },
      },
    }
  );
}
