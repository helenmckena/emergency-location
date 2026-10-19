import { createContext, useContext } from 'react';

import {
  getTranslations,
  type Locale,
} from '../../i18n';

export type { Locale };

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof getTranslations>;
}

export const LocaleContext =
  createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error(
      'useLocale must be used inside LocaleProvider',
    );
  }

  return context;
}
