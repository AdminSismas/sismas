import { wikiRepository } from '@/lib/db/db';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(
      JSON.stringify({ message: 'No existe un artículo con esa ruta' }),
      { status: 400 }
    );
  }

  const article = await wikiRepository.getArticle(slug);

  if (!article) {
    return new Response(
      JSON.stringify({
        message: 'No existe información de un artículo con esa ruta'
      }),
      { status: 400 }
    );
  }

  return new Response(JSON.stringify(article), { status: 200 });
};

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const body = await request.json();
    const { slug } = params;
    const { title, content, position } = body;

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
      position,
      title,
      content,
      updatedAt: new Date(),
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;

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
