import { SideMenuWiki } from './components/SideMenuWiki';

export function WikiLayout() {
  return (
    <div className="h-full flex">
      <SideMenuWiki />
      <section className="w-3/4 lg:w-5/6">
        <h2 className="text-xl font-semibold text-base-content">Contenido</h2>
      </section>
    </div>
  );
}
