import { Routes, Route } from 'react-router-dom';
import { Footer } from './layouts/Footer';
import { Header } from './layouts/Header';
import { routes } from './routes';

import type { RouteConfig } from './routes';

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>{renderRoutes(routes)}</Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
