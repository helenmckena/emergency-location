import {
  translations,
  type Locale,
} from './translations';

export type { Locale };

export function getTranslations(locale: Locale) {
  return translations[locale];
}