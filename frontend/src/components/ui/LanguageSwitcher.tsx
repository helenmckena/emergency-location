import { useEffect, useRef, useState } from 'react';

import {
  useLocale,
  type Locale,
} from '../../app/providers/LocaleContext';
import {
  ChevronDownIcon,
  TranslateIcon,
} from './icons';

const locales: { value: Locale; label: string }[] = [
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' },
  { value: 'kk', label: 'KZ' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="language-switcher" ref={rootRef}>
      <button
        type="button"
        className="language-switcher__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <TranslateIcon className="language-switcher__icon" />

        <span>RU / EN / KZ</span>

        <ChevronDownIcon className="language-switcher__chevron" />
      </button>

      {open && (
        <ul className="language-switcher__menu" role="listbox">
          {locales.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                role="option"
                aria-selected={locale === item.value}
                className="language-switcher__option"
                data-active={locale === item.value}
                onClick={() => {
                  setLocale(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
