import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="grid gap-8">
      {/* Welcome Section */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold bg-linear-to-r from-(--color-primary) to-(--color-accent) bg-clip-text text-transparent mb-4">
          Bienvenido a la Wiki
        </h2>
        <p className="text-(--color-text-muted) text-lg max-w-2xl mx-auto">
          Encuentra documentación, guías y tutoriales para aprovechar al máximo
          el Sistema Catastral GeoGestión.
        </p>
      </section>

      {/* Quick Links Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Guía de Inicio',
            description: 'Primeros pasos con GeoGestión',
            icon: '🚀',
            path: '/guide'
          },
          {
            title: 'Manual de Usuario',
            description: 'Documentación completa del sistema',
            icon: '📖',
            path: '/manual'
          },
          {
            title: 'FAQ',
            description: 'Preguntas frecuentes',
            icon: '❓',
            path: '/faq'
          }
        ].map((item, i) => (
          <Link
            to={item.path}
            key={i}
            className="group p-6 rounded-xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-primary) transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-(--color-primary)/10"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-(--color-text) group-hover:text-(--color-primary) transition-colors">
              {item.title}
            </h3>
            <p className="text-(--color-text-muted) text-sm mt-2">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Home;
