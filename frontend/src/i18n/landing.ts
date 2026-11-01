import type { Locale } from './translations';

export interface LandingContent {
  titleLines: [string, string, string];
  text: string;
  open: string;
  how: string;
  chip: string;
  problemTitle: string;
  problemText: string;
  problems: { title: string; text: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  compareTitle: string;
  compareText: string;
  columns: string[];
  rows: string[];
  footer: {
    subtitle: string;
    contacts: string;
    privacy: string;
    contactsText: string;
    close: string;
  };
}

export const landingContent: Record<Locale, LandingContent> = {
  ru: {
    titleLines: ['Узнайте,', 'где человек,', 'за секунды'],
    text: 'Пострадавший нажимает на ссылку и делится геолокацией и фото. Оператор видит его на карте в реальном времени.',
    open: 'Открыть сервис',
    how: 'Как это работает',
    chip: 'Геопозиция получена',
    problemTitle: 'Проблема',
    problemText:
      'В критический момент слов недостаточно. Каждая потерянная минута увеличивает риск.',
    problems: [
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
    ],
    stepsTitle: 'Как это работает',
    steps: [
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
    ],
    compareTitle: 'Чем мы лучше',
    compareText:
      'У пострадавшего нет барьера входа: достаточно нажать на ссылку.',
    columns: [
      'Критерий',
      'Emergency Location',
      'Голосовой звонок',
      'Приложения служб',
      'Мессенджеры',
    ],
    rows: [
      'Без своего приложения',
      'Без регистрации и пароля',
      'Фото пострадавшего',
      'Обновления в реальном времени',
      'Карта у оператора в браузере',
    ],
    footer: {
      subtitle: 'сервис оперативной передачи геоданных',
      contacts: 'Контакты',
      privacy: 'Политика конфиденциальности',
      contactsText: 'По всем вопросам работы сервиса пишите нам',
      close: 'Закрыть',
    },
  },
  en: {
    titleLines: ['Find out', 'where a person is', 'in seconds'],
    text: 'The caller taps a link and shares their location and photos. The operator sees them on the map in real time.',
    open: 'Open the service',
    how: 'How it works',
    chip: 'Location received',
    problemTitle: 'The problem',
    problemText:
      'In an emergency, words are not enough. Every lost minute raises the risk.',
    problems: [
      {
        title: 'Words only',
        text: 'The operator cannot pinpoint the caller’s position from what they say.',
      },
      {
        title: 'Stress',
        text: 'A person in trouble often cannot explain where they are.',
      },
      {
        title: 'Extra friction',
        text: 'Installing an app, signing up and setting a password are barriers at the worst moment.',
      },
    ],
    stepsTitle: 'How it works',
    steps: [
      {
        title: 'The operator enters a number',
        text: 'The emergency operator types in the phone number of the person who needs help.',
      },
      {
        title: 'Sends a link',
        text: 'In one click: Telegram, WhatsApp or SMS from the operator’s phone. It is free.',
      },
      {
        title: 'The person shares their location',
        text: 'They open the link in a browser and share their position and photos with one tap.',
      },
      {
        title: 'A point on the map',
        text: 'The operator sees where the person is in real time and directs the crew.',
      },
    ],
    compareTitle: 'Why we are better',
    compareText:
      'There is no entry barrier for the caller: one tap on a link is enough.',
    columns: [
      'Criteria',
      'Emergency Location',
      'Voice call',
      'Service apps',
      'Messengers',
    ],
    rows: [
      'No app of our own',
      'No sign-up or password',
      'Photo from the caller',
      'Real-time updates',
      'Operator map in the browser',
    ],
    footer: {
      subtitle: 'a service for fast location sharing',
      contacts: 'Contacts',
      privacy: 'Privacy policy',
      contactsText: 'For any questions about the service, write to us',
      close: 'Close',
    },
  },
  kk: {
    titleLines: ['Біліңіз,', 'адам қайда екенін', 'бірнеше секундта'],
    text: 'Зардап шегуші сілтемені басып, геолокациясы мен фотосын жібереді. Оператор оны картада нақты уақытта көреді.',
    open: 'Қызметті ашу',
    how: 'Бұл қалай жұмыс істейді',
    chip: 'Геолокация алынды',
    problemTitle: 'Мәселе',
    problemText:
      'Шұғыл сәтте сөз жеткіліксіз. Жоғалған әр минут қауіпті арттырады.',
    problems: [
      {
        title: 'Тек сөздер',
        text: 'Оператор қоңырау шалушының орнын сөзден дәл анықтай алмайды.',
      },
      {
        title: 'Стресс',
        text: 'Зардап шегуші қайда екенін әрдайым түсіндіре алмайды.',
      },
      {
        title: 'Артық кедергі',
        text: 'Қолданбаны орнату, тіркелу және құпиясөз шұғыл сәтте кедергі болады.',
      },
    ],
    stepsTitle: 'Бұл қалай жұмыс істейді',
    steps: [
      {
        title: 'Оператор нөмірді енгізеді',
        text: 'Шұғыл қызмет операторы көмек керек адамның телефон нөмірін енгізеді.',
      },
      {
        title: 'Сілтеме жібереді',
        text: 'Бір басумен: Telegram, WhatsApp немесе оператордың телефонынан SMS. Бұл тегін.',
      },
      {
        title: 'Адам орнын бөліседі',
        text: 'Ол сілтемені браузерде ашып, бір басумен геолокация мен фото жібереді.',
      },
      {
        title: 'Картадағы нүкте',
        text: 'Оператор адамның қайда екенін нақты уақытта көріп, бригаданы бағыттайды.',
      },
    ],
    compareTitle: 'Біз неліктен жақсымыз',
    compareText:
      'Зардап шегушіге кіру кедергісі жоқ: сілтемені басу жеткілікті.',
    columns: [
      'Өлшем',
      'Emergency Location',
      'Дауыстық қоңырау',
      'Қызмет қолданбалары',
      'Мессенджерлер',
    ],
    rows: [
      'Өз қолданбасыз',
      'Тіркелусіз және құпиясөзсіз',
      'Зардап шегушінің фотосы',
      'Нақты уақыттағы жаңарту',
      'Оператор картасы браузерде',
    ],
    footer: {
      subtitle: 'геодеректерді жедел жіберу қызметі',
      contacts: 'Байланыс',
      privacy: 'Құпиялылық саясаты',
      contactsText: 'Қызметке қатысты барлық сұрақтар бойынша бізге жазыңыз',
      close: 'Жабу',
    },
  },
};
