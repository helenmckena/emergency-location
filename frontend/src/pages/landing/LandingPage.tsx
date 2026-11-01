import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { PinIcon } from '../../components/ui/icons';
import { useLocale } from '../../app/providers/LocaleContext';
import { landingContent } from '../../i18n/landing';

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PROBLEM_ICONS = [
  <LineIcon key="chat">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </LineIcon>,
  <LineIcon key="alert">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </LineIcon>,
  <LineIcon key="lock">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </LineIcon>,
];

// колонки: мы, звонок, приложения служб, мессенджеры
const COMPARE: boolean[][] = [
  [true, true, false, true],
  [true, true, false, false],
  [true, false, true, true],
  [true, false, true, true],
  [true, false, false, false],
];

export function LandingPage() {
  const { locale } = useLocale();
  const c = landingContent[locale];

  return (
    <div className="page lp-page">
      <Header />

      <main className="lp">
        <section className="lp-hero">
          <div className="lp-hero__text">
            <h1 className="lp-title">
              <span className="lp-title__line">{c.titleLines[0]}</span>
              <span className="lp-title__line">{c.titleLines[1]}</span>
              <span className="lp-title__line lp-title__accent">
                {c.titleLines[2]}
              </span>
            </h1>

            <p className="lp-lead">{c.text}</p>

            <div className="lp-actions">
              <Link to="/operator" className="lp-button">
                {c.open}
              </Link>

              <a href="#how" className="lp-button lp-button--ghost">
                {c.how}
              </a>
            </div>
          </div>

          <div className="lp-visual" aria-hidden="true">
            <div className="lp-map">
              <span className="lp-pin">
                <span className="lp-pin__pulse" />
                <PinIcon className="lp-pin__icon" />
              </span>
              <span className="lp-coords">43.2380, 76.9450</span>
              <span className="lp-chip">{c.chip}</span>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-heading">{c.problemTitle}</h2>
          <p className="lp-text">{c.problemText}</p>

          <ul className="lp-grid lp-grid--3">
            {c.problems.map((item, index) => (
              <li key={item.title} className="lp-card">
                <span className="lp-icon">{PROBLEM_ICONS[index]}</span>
                <h3 className="lp-card__title">{item.title}</h3>
                <p className="lp-card__text">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="lp-section" id="how">
          <h2 className="lp-heading">{c.stepsTitle}</h2>

          <ol className="lp-grid lp-grid--4">
            {c.steps.map((step, index) => (
              <li key={step.title} className="lp-card">
                <span className="lp-step">{index + 1}</span>
                <h3 className="lp-card__title">{step.title}</h3>
                <p className="lp-card__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="lp-section">
          <h2 className="lp-heading">{c.compareTitle}</h2>
          <p className="lp-text">{c.compareText}</p>

          <div className="lp-table-wrap">
            <table className="lp-table">
              <thead>
                <tr>
                  {c.columns.map((column, index) => (
                    <th key={column} className={index === 1 ? 'lp-us' : undefined}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row, rowIndex) => (
                  <tr key={row}>
                    <td>{row}</td>
                    {COMPARE[rowIndex].map((value, index) => (
                      <td key={index} className={index === 0 ? 'lp-us' : undefined}>
                        <span className={value ? 'lp-yes' : 'lp-no'}>
                          {value ? '✓' : '✗'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
