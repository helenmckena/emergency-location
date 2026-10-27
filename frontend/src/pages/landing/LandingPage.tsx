import { Link } from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { PinIcon } from '../../components/ui/icons';

const STEPS = [
  {
    title: 'Оператор вводит номер',
    text: 'Оператор экстренной службы вводит номер телефона человека, которому нужна помощь.',
  },
  {
    title: 'Пострадавший получает SMS',
    text: 'На телефон приходит короткая ссылка. Приложение устанавливать не нужно.',
  },
  {
    title: 'Передача геопозиции',
    text: 'Человек открывает ссылку и одним нажатием делится местоположением.',
  },
  {
    title: 'Точка на карте',
    text: 'Оператор сразу видит, где находится человек, и может получить фото с места.',
  },
];

const FEATURES = [
  {
    title: 'Быстро',
    text: 'От звонка до точки на карте проходит меньше минуты.',
  },
  {
    title: 'Без приложения',
    text: 'Ссылка открывается в обычном браузере телефона.',
  },
  {
    title: 'Точное место',
    text: 'Координаты обновляются на карте в реальном времени.',
  },
  {
    title: 'Фото с места',
    text: 'Пострадавший может отправить снимок, чтобы оператор лучше понимал ситуацию.',
  },
];

export function LandingPage() {
  return (
    <div className="page">
      <Header />

      <main className="landing">
        <section className="landing__hero">
          <PinIcon className="landing__hero-icon" />

          <h1 className="landing__title">Emergency Location</h1>

          <p className="landing__lead">
            Сервис оперативной передачи геоданных: оператор
            экстренной службы быстро узнаёт, где находится человек,
            которому нужна помощь.
          </p>

          <div className="landing__actions">
            <Link to="/operator" className="landing__button">
              Открыть сервис
            </Link>

            <a href="#how" className="landing__button landing__button--ghost">
              Как это работает
            </a>
          </div>
        </section>

        <section className="landing__section">
          <h2 className="landing__heading">Проблема</h2>

          <p className="landing__text">
            Когда человек звонит в экстренную службу, он часто не
            может точно назвать, где находится: в незнакомом месте,
            в панике или без ориентиров. Каждая потерянная минута
            увеличивает риск. Emergency Location убирает это
            препятствие: местоположение передаётся автоматически.
          </p>
        </section>

        <section className="landing__section" id="how">
          <h2 className="landing__heading">Как это работает</h2>

          <ol className="landing__steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="landing__card">
                <span className="landing__step-number">
                  {index + 1}
                </span>
                <h3 className="landing__card-title">{step.title}</h3>
                <p className="landing__card-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing__section">
          <h2 className="landing__heading">Преимущества</h2>

          <ul className="landing__features">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="landing__card">
                <h3 className="landing__card-title">{feature.title}</h3>
                <p className="landing__card-text">{feature.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing__cta">
          <h2 className="landing__heading">Попробуйте сервис</h2>

          <p className="landing__text">
            Откройте демо-версию и пройдите весь путь: от ввода
            номера до точки на карте.
          </p>

          <Link to="/operator" className="landing__button">
            Открыть сервис
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
