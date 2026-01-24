import { db, Articles } from 'astro:db';

export default async function () {
  await db.insert(Articles).values([
    {
      title: 'Bienvenido a Sismas Manual',
      slug: 'bienvenida',
      content:
        '# Bienvenido\n\nEste es el manual interno de Sismas.\n\n## Características\n- Renderizado SSR rápido\n- Editor interactivo\n- Integración con el ecosistema existente',
      updatedAt: new Date(),
      author: 'Admin'
    }
  ]);
}
