import { NavLink, Outlet } from 'react-router-dom';
import { wikiRoutes } from '../wiki-page.routes';
import { WikiPageHeader } from '@layouts/WikiPageHeader';
import { useDarkTheme } from '@layouts/hooks/useDarkTheme';
import { AsideHeader } from '@/layouts/AsideHeader';
import logoLight from '@assets/logos/logo_sismas.png';
import logoDark from '@assets/logos/logo_sismas_dark.png';
import { useRef } from 'react';

export function WikiPage() {
  const { isDark, onChangeDark } = useDarkTheme();

  const currentLogo = isDark ? logoDark : logoLight;

  const drawerToggleRef = useRef<HTMLInputElement>(null);
  const handleDrawerToggle = () => {
    if (drawerToggleRef.current) drawerToggleRef.current.checked = false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="drawer lg:drawer-open flex-1">
        <input
          ref={drawerToggleRef}
          id="drawer-menu"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col">
          <header className="bg-base-200 border-b border-base-300 sticky top-0 flex justify-between lg:justify-end items-center h-16 pr-4 sm:pr-6 lg:pr-8">
            <label
              htmlFor="drawer-menu"
              className="ml-4 btn btn-soft btn-accent drawer-button lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right-pipe"
              >
                <path
                  stroke="none"
                  d="M0 0h24v24H0z"
                  fill="none"
                />
                <path d="M6 6l6 6l-6 6" />
                <path d="M17 5v13" />
              </svg>
            </label>

            <WikiPageHeader
              isDark={isDark}
              onChangeDark={onChangeDark}
            />
          </header>
          <Outlet />
        </div>
        <div className="drawer-side h-screen lg:sticky lg:top-0 lg:left-0">
          <label
            htmlFor="drawer-menu"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex flex-col h-screen">
            <header className="w-80 lg:w-full bg-base-200 border-b border-base-300 sticky top-0 flex justify-center lg:justify-start items-center h-16 pl-4 sm:pl-6 lg:pl-8">
              <AsideHeader currentLogo={currentLogo} />
              <label
                htmlFor="drawer-menu"
                className="btn btn-soft btn-accent drawer-button lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left-pipe"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M7 6v12" />
                  <path d="M18 6l-6 6l6 6" />
                </svg>
              </label>
            </header>
            <ul className="menu bg-base-200 flex-1 w-80 p-4">
              {wikiRoutes.map((route) => (
                <li key={route.path}>
                  <NavLink
                    to={route.path}
                    onClick={handleDrawerToggle}
                  >
                    {route.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
