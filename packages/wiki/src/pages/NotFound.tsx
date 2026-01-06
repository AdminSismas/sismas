import { HomeHeader } from '@layouts/HomeHeader';

export function NotFound() {
  return (
    <>
      <HomeHeader />
      <div>
        <h1>404 - Página no encontrada</h1>
        <p>Lo siento, la página que estás buscando no existe.</p>
      </div>
    </>
  );
}
