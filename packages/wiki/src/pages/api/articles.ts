import type { APIRoute } from 'astro';
import { wikiRepository, type WikiArticle } from '@lib/db/db';

export const GET: APIRoute = async () => {
  const articles = await wikiRepository.listArticles();
  return new Response(JSON.stringify(articles), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as WikiArticle;
    const { slug, title, content, position } = body;

    if (!slug || !title || !content) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos obligatorios' }),
        { status: 400 }
      );
    }

    const dbResponse = await wikiRepository.getArticle(slug);
    const article = dbResponse[0] ?? null;
    if (article) {
      return new Response(
        JSON.stringify({ message: 'Ya existe un artículo con esa ruta' }),
        { status: 400 }
      );
    }

    await wikiRepository.saveArticle({
      slug,
      position,
      title,
      content,
      updatedAt: new Date(),
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
