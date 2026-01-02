import { Routes, Route } from 'react-router-dom';
import { Footer } from './layout/components/Footer';
import { Header } from './layout/components/Header';
import { routes } from './routes';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-10 sm:px-12 lg:px-16 py-12">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
