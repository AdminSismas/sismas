export function SideMenuWiki() {
  return (
    <aside className="w-1/4 lg:w-1/6 border-r border-base-content/50">
      <div className="flex flex-col gap-4">
        <span className="pl-4 w-full">
          <h2 className="text-2xl lg:text-3xl font-semibold text-primary-content">
            Contenido
          </h2>
        </span>
        <ul className="flex flex-col gap-2 pl-2">
          <li className="border-b border-base-content hover:bg-accent">
            <a
              href="#"
              className="text-base-content hover:text-primary-content p-2"
            >
              Introducción
            </a>
          </li>
          <li className="border-b border-base-content hover:bg-accent">
            <a
              href="#"
              className="text-base-content hover:text-primary-content p-2"
            >
              Capítulo 1
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
