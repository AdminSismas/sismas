import React from 'react';
import { QuickLink } from '../features/Home/components/QuickLink';
import { QUICK_LINKS } from '../features/Home/constants/quick-links';

const Home: React.FC = () => {
  return (
    <div className="grid gap-8">
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold bg-linear-to-r from-(--color-primary) to-(--color-accent) bg-clip-text text-transparent mb-4">
          Bienvenido a la Wiki
        </h2>
        <div className="flex justify-center py-10">
          <p className="text-(--color-text-muted) text-lg max-w-2xl mx-auto">
            Encuentra documentación, guías y tutoriales para aprovechar al
            máximo el Sistema Catastral GeoGestión.
          </p>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {QUICK_LINKS.map((item, i) => (
          <QuickLink
            key={i}
            {...item}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
