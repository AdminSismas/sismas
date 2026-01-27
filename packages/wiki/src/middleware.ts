import { defineMiddleware } from 'astro:middleware';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { Role } from '@/types/role';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get('token')?.value;

  if (!token) {
    context.locals.role = 'GUEST';
    return context.redirect('/login');
  }

  // Decode token and store role in locals (available globally)
  try {
    const decoded = jwtDecode<JwtPayload & { role: Role }>(token);
    context.locals.role = decoded.role ?? 'GUEST';
  } catch {
    context.locals.role = 'GUEST';
  }

  return next();
});
