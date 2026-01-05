import { Outlet } from 'react-router-dom';
import { SideMenuWiki } from '../features/Home/components/wikiPage/components/SideMenuWiki';

export function Wiki() {
  return (
    <div className="h-full flex">
      <SideMenuWiki />
      <section className="w-3/4 lg:w-5/6">
        <Outlet />
      </section>
    </div>
  );
}
