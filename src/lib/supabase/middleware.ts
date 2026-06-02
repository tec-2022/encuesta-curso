import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protect /admin routes (except /admin/login)
  if (path.startsWith('/admin')) {
    if (path !== '/admin/login') {
      if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Check if user is registered in admin_users
      const { data: isAdmin, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!isAdmin || error) {
        // Log out user since they are not an authorized admin
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL('/admin/login?error=unauthorized', request.url)
        );
      }
    } else {
      // If user is at /admin/login but already logged in, redirect to dashboard
      if (user) {
        const { data: isAdmin } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (isAdmin) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
    }
  }

  return response;
};
