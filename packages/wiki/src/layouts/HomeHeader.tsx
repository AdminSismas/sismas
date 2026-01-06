import logoLight from '@assets/logos/logo_sismas.png';
import logoDark from '@assets/logos/logo_sismas_dark.png';
import { WikiPageHeader } from './WikiPageHeader';
import { useDarkTheme } from './hooks/useDarkTheme';
import { AsideHeader } from './AsideHeader';

export function HomeHeader() {
  // isDark state and getUserPreferenceTheme function
  const { isDark, onChangeDark } = useDarkTheme();

  const currentLogo = isDark ? logoDark : logoLight;

  return (
    <header className="bg-base-200 border-b border-base-300 sticky top-0 z-50">
      <div className="flex gap-4 items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <AsideHeader currentLogo={currentLogo} />
        <WikiPageHeader
          isDark={isDark}
          onChangeDark={onChangeDark}
        />
      </div>
    </header>
  );
}
