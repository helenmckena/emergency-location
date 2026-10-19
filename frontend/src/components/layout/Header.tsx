import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        Emergency Geo
      </div>

      <LanguageSwitcher />
    </header>
  );
}