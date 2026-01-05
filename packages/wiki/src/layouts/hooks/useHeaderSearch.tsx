import { useState, useEffect } from 'react';

export function useHeaderSearch({
  inputSearch
}: {
  inputSearch: HTMLInputElement;
}) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMetaKeyDown = event.metaKey || event.ctrlKey;
      const isKKeyDown = event.key.toLowerCase() === 'k';

      if (isMetaKeyDown && isKKeyDown) {
        event.preventDefault();
        inputSearch?.focus();
      }
    };

    window.document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputSearch]);

  return {
    search,
    setSearch
  };
}
