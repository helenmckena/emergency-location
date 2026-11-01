import { useEffect, useState } from 'react';
import { GithubIcon, MailIcon, TelegramIcon } from '../ui/icons';
import { useLocale } from '../../app/providers/LocaleContext';
import { landingContent } from '../../i18n/landing';

// Адрес вашего репозитория: задайте VITE_GITHUB_URL (Vercel → Environment Variables)
const GITHUB_URL =
  import.meta.env.VITE_GITHUB_URL ??
  'https://github.com/helenmckena/emergency-location';
const TELEGRAM = 'jemapellezhasmin';
const EMAIL = 'z_tursynova@kbtu.kz';

export function Footer() {
  const [contactsOpen, setContactsOpen] = useState(false);
  const { locale } = useLocale();
  const footerText = landingContent[locale].footer;

  useEffect(() => {
    if (!contactsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContactsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [contactsOpen]);

  return (
    <>
    <footer className="app-footer">
      <div className="app-footer__info">
        <div className="app-footer__copyright">
          © 2026 Emergency Location
        </div>

        <div className="app-footer__subtitle">
          {footerText.subtitle}
        </div>
      </div>

      <nav className="app-footer__links">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon className="app-footer__link-icon" />
          GitHub
        </a>

        <button
          type="button"
          className="app-footer__link-button"
          onClick={() => setContactsOpen(true)}
        >
          <MailIcon className="app-footer__link-icon" />
          {footerText.contacts}
        </button>

        <a href="#privacy">
          {footerText.privacy}
        </a>
      </nav>
    </footer>

    {contactsOpen && (
      <div className="ct-overlay" onClick={() => setContactsOpen(false)}>
        <div
          className="ct-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contacts-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="ct-close"
            aria-label={footerText.close}
            onClick={() => setContactsOpen(false)}
          >
            ×
          </button>

          <h2 id="contacts-title" className="ct-title">
            {footerText.contacts}
          </h2>
          <p className="ct-text">{footerText.contactsText}</p>

          <a
            className="ct-item"
            href={`https://t.me/${TELEGRAM}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="ct-item__icon ct-item__icon--tg">
              <TelegramIcon />
            </span>
            <span className="ct-item__body">
              <small>Telegram</small>
              <b>@{TELEGRAM}</b>
            </span>
          </a>

          <a className="ct-item" href={`mailto:${EMAIL}`}>
            <span className="ct-item__icon">
              <MailIcon />
            </span>
            <span className="ct-item__body">
              <small>Email</small>
              <b>{EMAIL}</b>
            </span>
          </a>
        </div>
      </div>
    )}
    </>
  );
}
