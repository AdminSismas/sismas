import { Link } from 'react-router-dom';

interface QuickLinkProps {
  title: string;
  description: string;
  icon: string;
  path: string;
}

export function QuickLink({ title, description, icon, path }: QuickLinkProps) {
  return (
    <Link
      to={path}
      className="group p-6 rounded-xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-primary) transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-(--color-primary)/10"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-(--color-text) group-hover:text-(--color-primary) transition-colors">
        {title}
      </h3>
      <p className="text-(--color-text-muted) text-sm mt-2">{description}</p>
    </Link>
  );
}
