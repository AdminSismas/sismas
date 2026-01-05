import { NavLink } from 'react-router-dom';
import { wikiRoutes } from '../wiki-page.routes';

export function SideMenuWiki() {
  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
  // return (
  //   <aside className="w-1/4 lg:w-1/6 border-r p-2 lg:p-4 border-base-content/50 flex flex-col gap-4 ">
  //     <nav className="flex flex-col gap-2">
  //       {wikiRoutes.map((route) => (
  //         <NavLink
  //           key={route.path}
  //           to={route.path}
  //           className={({ isActive }) =>
  //             `px-2 w-full py-1 rounded-md transition-colors duration-200 ${
  //               isActive
  //                 ? 'bg-primary text-primary-content'
  //                 : 'text-base-content hover:bg-primary/20'
  //             }`
  //           }
  //         >
  //           {route.title}
  //         </NavLink>
  //       ))}
  //     </nav>
  //   </aside>
  // );
}
