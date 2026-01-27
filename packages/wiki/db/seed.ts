import { db, Articles } from 'astro:db';

export default async function () {
  await db.insert(Articles).values([
    {
      title: 'Bienvenido a Sismas Manual',
      position: 1,
      slug: 'bienvenida',
      content:
        '# Bienvenido\n\nEste es el manual interno de Sismas.\n\n## Características\n- Renderizado SSR rápido\n- Editor interactivo\n- Integración con el ecosistema existente',
      updatedAt: new Date(),
      author: 'Admin'
    },
    {
      title: 'Prueba',
      position: 2,
      slug: 'prueba',
      content:
        '# Prueba\n\nEste es el manual interno de Sismas.\n\n## Características\n- Renderizado SSR rápido\n- Editor interactivo\n- Integración con el ecosistema existente',
      updatedAt: new Date(),
      author: 'Admin'
    }
  ]);
}
