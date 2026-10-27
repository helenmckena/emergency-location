import { Link } from 'react-router-dom';

import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        Emergency Geo
      </Link>

      <LanguageSwitcher />
    </header>
  );
}