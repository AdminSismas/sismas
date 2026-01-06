import { Routes, Route } from 'react-router-dom';
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
    <div className="h-screen w-screen flex flex-col dvh xl:pl-16 xl:pr-12">
      <Routes>{renderRoutes(routes)}</Routes>
    </div>
  );
}

export default App;
