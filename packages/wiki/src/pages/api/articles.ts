import type { APIRoute } from 'astro';
import { wikiRepository } from '@/lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { slug, title, content } = body;

    if (!slug || !title || !content) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos obligatorios' }),
        { status: 400 }
      );
    }

    const article = await wikiRepository.getArticle(slug);
    if (article) {
      return new Response(
        JSON.stringify({ message: 'Ya existe un artículo con esa ruta' }),
        { status: 400 }
      );
    }

    await wikiRepository.saveArticle({
      slug,
      title,
      content,
      updatedAt: new Date().toISOString(),
      author: 'Admin'
    });

    return new Response(
      JSON.stringify({ message: 'Artículo guardado exitosamente' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
};

export const GET: APIRoute = async () => {
  const articles = await wikiRepository.listArticles();
  return new Response(JSON.stringify(articles), { status: 200 });
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { slug, title, content } = body;

    if (!slug || !title || !content) {
      return new Response(
        JSON.stringify({
          message: 'El título, la ruta y el contenido son obligatorios'
        }),
        { status: 400 }
      );
    }

    await wikiRepository.editArticle({
      slug,
      title,
      content,
      updatedAt: new Date().toISOString(),
      author: 'Admin'
    });

    return new Response(
      JSON.stringify({
        message: 'Articulo guardado exitosamente'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { slug } = await body;

    if (!slug) {
      return new Response(
        JSON.stringify({
          message: 'La ruta del artículo a borrar es obligatoria'
        }),
        { status: 400 }
      );
    }

    await wikiRepository.deleteArticle(slug);

    return new Response(JSON.stringify({ message: 'Artículo' }));
  } catch (error) {
    console.error('API Error: ', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
};
