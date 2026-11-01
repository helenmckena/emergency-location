import { Link } from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { PinIcon } from '../../components/ui/icons';

const PROBLEMS = [
  {
    title: 'Только слова',
    text: 'Оператор не может точно установить место звонящего со слов.',
  },
  {
    title: 'Стресс',
    text: 'Пострадавший не всегда может объяснить, где он находится.',
  },
  {
    title: 'Лишнее трение',
    text: 'Установка приложения, регистрация и пароль — барьер в критический момент.',
  },
];

const STEPS = [
  {
    title: 'Оператор вводит номер',
    text: 'Оператор экстренной службы вводит номер телефона человека, которому нужна помощь.',
  },
  {
    title: 'Отправляет ссылку',
    text: 'В один клик: Telegram, WhatsApp или SMS с телефона оператора. Это бесплатно.',
  },
  {
    title: 'Человек делится местом',
    text: 'Он открывает ссылку в браузере и одним нажатием отправляет геопозицию и фото.',
  },
  {
    title: 'Точка на карте',
    text: 'Оператор видит, где находится человек, в реальном времени и направляет бригаду.',
  },
];

const COMPARE_ROWS: [string, boolean, boolean, boolean, boolean][] = [
  ['Без своего приложения', true, true, false, true],
  ['Без регистрации и пароля', true, true, false, false],
  ['Фото пострадавшего', true, false, true, true],
  ['Обновления в реальном времени', true, false, true, true],
  ['Карта у оператора в браузере', true, false, false, false],
];

function Mark({ value }: { value: boolean }) {
  return (
    <span className={value ? 'landing__yes' : 'landing__no'}>
      {value ? '✓' : '✗'}
    </span>
  );
}

export function LandingPage() {
  return (
    <div className="page">
      <Header />

      <main className="landing">
        <section className="landing__hero">
          <span className="landing__badge">
            Для служб 112, скорой помощи и МЧС
          </span>

          <PinIcon className="landing__hero-icon" />

          <h1 className="landing__title">
            Узнайте, где человек, <span>за секунды</span>
          </h1>

          <p className="landing__lead">
            Пострадавший нажимает на ссылку и делится геолокацией и фото.
            Оператор видит его на карте в реальном времени, без установки
            приложения и регистрации.
          </p>

          <div className="landing__actions">
            <Link to="/operator" className="landing__button">
              Открыть сервис
            </Link>

            <a href="#contact" className="landing__button landing__button--ghost">
              Запустить пилот
            </a>
          </div>
        </section>

        <section className="landing__section">
          <h2 className="landing__heading">Проблема</h2>
          <p className="landing__text">
            В критический момент слов недостаточно. Каждая потерянная
            минута увеличивает риск.
          </p>

          <ul className="landing__features">
            {PROBLEMS.map((item) => (
              <li key={item.title} className="landing__card">
                <h3 className="landing__card-title">{item.title}</h3>
                <p className="landing__card-text">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing__section" id="how">
          <h2 className="landing__heading">Как это работает</h2>

          <ol className="landing__steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="landing__card">
                <span className="landing__step-number">{index + 1}</span>
                <h3 className="landing__card-title">{step.title}</h3>
                <p className="landing__card-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing__section">
          <h2 className="landing__heading">Чем мы лучше</h2>
          <p className="landing__text">
            У пострадавшего нет барьера входа: достаточно нажать на ссылку.
          </p>

          <div className="landing__table-wrap">
            <table className="landing__table">
              <thead>
                <tr>
                  <th>Критерий</th>
                  <th className="landing__us">Emergency Location</th>
                  <th>Голосовой звонок</th>
                  <th>Приложения служб</th>
                  <th>Мессенджеры</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(([label, ...marks]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    {marks.map((mark, index) => (
                      <td
                        key={index}
                        className={index === 0 ? 'landing__us' : undefined}
                      >
                        <Mark value={mark} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="landing__section">
          <div className="landing__price">
            <div>
              <h2 className="landing__heading">Тариф</h2>
              <p className="landing__price-note">
                Подписка для диспетчерского центра
              </p>
              <p className="landing__price-value">
                $200 <span>в месяц</span>
              </p>
            </div>

            <div className="landing__price-free">
              <strong>Первый пилот бесплатно</strong>
              <p>Подключаем один центр и вместе настраиваем работу.</p>
            </div>
          </div>
        </section>

        <section className="landing__cta" id="contact">
          <h2 className="landing__heading">Давайте проведём пилот</h2>

          <p className="landing__text">
            Ищем первую диспетчерскую службу и партнёров. Напишите нам.
          </p>

          <div className="landing__actions">
            <a
              className="landing__button"
              href="https://t.me/jemapellezhasmin"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>

            <a
              className="landing__button landing__button--ghost"
              href="mailto:z_tursynova@kbtu.kz"
            >
              z_tursynova@kbtu.kz
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
