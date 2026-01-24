import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get('token')?.value;
  if (!token) {
    return context.redirect('/login');
  }
  return next();
});
