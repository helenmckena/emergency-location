import {
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getTranslations } from '../../i18n';
import {
  LocaleContext,
  type Locale,
} from './LocaleContext';

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({
  children,
}: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>('ru');

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: getTranslations(locale),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}
