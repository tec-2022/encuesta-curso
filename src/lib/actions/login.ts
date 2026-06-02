'use server';

import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Por favor completa todos los campos.' };
  }

  try {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { success: false, error: 'El correo o la contraseña no son correctos.' };
    }

    // Check if user is in admin_users
    const { data: isAdmin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (!isAdmin || adminError) {
      // Log out immediately if not authorized
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Esta cuenta no tiene acceso al panel administrativo.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Ocurrió un error inesperado al iniciar sesión.' };
  }
}
