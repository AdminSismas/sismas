import { Link } from 'react-router-dom';

export function AsideHeader({ currentLogo }: { currentLogo: string }) {
  return (
    <div className="flex gap-2 items-center">
      <Link
        to="/"
        className="flex items-center gap-3 hover:bg-base-300 hover:rounded-lg p-2 transition-colors"
      >
        <img
          src={currentLogo}
          alt="Logo de Sismas"
          width={150}
        />
        <h1 className="text-xl hidden lg:block lg:text-3xl font-semibold text-base-content">
          Wiki
        </h1>
      </Link>
    </div>
  );
}
