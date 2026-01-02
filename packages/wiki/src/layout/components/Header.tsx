export function Header() {
  return (
    <header className="bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-(--color-primary) to-(--color-secondary) flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-(--color-text)">
                Wiki GeoGestión
              </h1>
              <p className="text-xs text-(--color-text-muted)">
                Documentación del Sistema Catastral
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="/"
              className="text-(--color-text-muted) hover:text-(--color-text) transition-colors text-sm"
            >
              ← Volver a GeoGestión
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
