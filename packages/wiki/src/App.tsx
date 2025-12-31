import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[var(--color-text)]">Wiki GeoGestión</h1>
                <p className="text-xs text-[var(--color-text-muted)]">Documentación del Sistema Catastral</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <a 
                href="/" 
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
              >
                ← Volver a GeoGestión
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          {/* Welcome Section */}
          <section className="text-center py-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent mb-4">
              Bienvenido a la Wiki
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
              Encuentra documentación, guías y tutoriales para aprovechar al máximo el Sistema Catastral GeoGestión.
            </p>
          </section>

          {/* Quick Links Grid */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Guía de Inicio', description: 'Primeros pasos con GeoGestión', icon: '🚀' },
              { title: 'Manual de Usuario', description: 'Documentación completa del sistema', icon: '📖' },
              { title: 'FAQ', description: 'Preguntas frecuentes', icon: '❓' },
            ].map((item, i) => (
              <article 
                key={i}
                className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-primary)]/10"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm mt-2">
                  {item.description}
                </p>
              </article>
            ))}
          </section>

          {/* Tech Stack Badge */}
          <section className="flex justify-center gap-4 pt-8">
            <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
              React 19
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
              Tailwind CSS 4
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
              Vite 7
            </span>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6">
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} GeoGestión - Sistema Catastral
        </p>
      </footer>
    </div>
  )
}

export default App

