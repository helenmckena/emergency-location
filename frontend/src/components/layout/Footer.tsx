import { useState } from 'react';
import { GithubIcon, MailIcon } from '../ui/icons';

const TELEGRAM = 'jemapellezhasmin';
const EMAIL = 'z_tursynova@kbtu.kz';

export function Footer() {
  const [contactsOpen, setContactsOpen] = useState(false);

  return (
    <>
    <footer className="app-footer">
      <div className="app-footer__info">
        <div className="app-footer__copyright">
          © 2026 Emergency Location
        </div>

        <div className="app-footer__subtitle">
          сервис оперативной передачи геоданных
        </div>
      </div>

      <nav className="app-footer__links">
        <a
          href="https://github.com/smileBlueRose/emergency-location"
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
          Контакты
        </button>

        <a href="#privacy">
          Политика конфиденциальности
        </a>
      </nav>
    </footer>

    {contactsOpen && (
      <div
        className="contacts-modal__overlay"
        onClick={() => setContactsOpen(false)}
      >
        <div
          className="contacts-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contacts-title"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="contacts-title" className="contacts-modal__title">
            Контакты
          </h2>
          <p className="contacts-modal__text">
            По всем вопросам работы сервиса пишите нам:
          </p>
          <div className="contacts-modal__row">
            <span>Telegram:</span>
            <a
              href={`https://t.me/${TELEGRAM}`}
              target="_blank"
              rel="noreferrer"
            >
              @{TELEGRAM}
            </a>
          </div>
          <div className="contacts-modal__row">
            <span>Email:</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <button
            type="button"
            className="contacts-modal__close"
            onClick={() => setContactsOpen(false)}
          >
            Закрыть
          </button>
        </div>
      </div>
    )}
    </>
  );
}
