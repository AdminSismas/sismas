import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';

interface DropDownMenuProps {
  slug: string;
}

type ActionType = 'edit' | 'delete';

export function DropDownMenu({ slug }: DropDownMenuProps) {
  const handleAction = (action: ActionType, slug: string) => {
    switch (action) {
      case 'edit':
        window.location.assign(`/wiki/edit/${slug}`);
        break;
      case 'delete':
        if (confirm(`¿Estás seguro de eliminar "${slug}"?`)) {
          fetch(`/api/articles/${slug}`, { method: 'DELETE' }).then((res) => {
            if (res.ok) {
              window.location.reload();
            }
          });
        }
        break;
    }
  };

  const options: { label: string; action: ActionType }[] = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-dots-vertical"
          >
            <path
              stroke="none"
              d="M0 0h24v24H0z"
              fill="none"
            />
            <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={() => handleAction(option.action, slug)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
