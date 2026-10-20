import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = 'https://emergency-location.com/api/v1';
const WS_BASE = 'wss://emergency-location.com/api/v1';

// Временный переключатель: пока бэкендер не добавил CORS для
// capacitor://localhost / http://localhost / https://localhost,
// реальные запросы будут падать. USE_MOCK=true позволяет тестировать
// весь UI-флоу локально без сети. Когда бэкенд разрешит origin -
// просто поставь USE_MOCK = false.
const USE_MOCK = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
  async createLocationShareRequest(phone) {
    await delay(900);
    return { id: Math.floor(Math.random() * 100000), phone };
  },
  async submitLocationRecord(requestId, latitude, longitude) {
    await delay(600);
    return { id: 1, request_id: requestId, latitude, longitude };
  },
  async uploadPhotoShare(requestId, file) {
    await delay(700);
    return { id: Math.floor(Math.random() * 100000), url: URL.createObjectURL(file) };
  },
};

const T = {
  RU: {
    title: 'emergency Geolocation',
    subtitle: 'Запросите геолокацию пострадавшего по номеру телефона',
    button: 'Запросить геолокацию',
    creating: 'Создаём заявку...',
    invalidPhone: 'Неправильный формат телефона. Номер должен начинаться с (+) кода страны',
    requestError: 'Произошла ошибка во время отправки запроса.',
    timerPrefix: 'До следующего запроса: ',
    sharingBanner: 'Ожидаем геолокацию от пострадавшего…',
    mapHint: 'Геопозиция пострадавшего получена',
    coordsPrefix: 'Координаты: ',
    attachPhoto: 'Прикрепить фото',
    sendPhoto: 'Отправить фото',
    sendingPhoto: 'Отправка...',
    photoSent: 'Фото отправлены',
    invalidImage: 'Файл не является изображением',
    invalidImageSub: 'Поддерживаются JPG, PNG, WEBP, HEIC',
    tooMany: 'Вы можете прикрепить не более 20 фото',
    backHome: '← Назад на главную',
    footerDesc: 'сервис оперативной передачи геоданных',
    github: 'GitHub', contacts: 'Контакты', privacy: 'Политика конфиденциальности',
    privacySoon: 'Документ пока в разработке',
    privacyTitle: 'Политика конфиденциальности',
    privacyBody: 'Мы собираем только те данные, которые необходимы для оказания экстренной помощи: номер телефона, геолокацию и фотографии, отправленные пострадавшим по ссылке. Эти данные передаются оператору службы и не используются в иных целях. Полная редакция документа появится здесь в ближайшее время.',
    contactsTitle: 'Контакты',
    contactsBody: 'По всем вопросам работы сервиса пишите нам:',
    close: 'Закрыть',
    mapLoading: 'Определяем геопозицию…',
    geoDenied: 'Не удалось определить геопозицию. Разрешите доступ к геолокации.',
    sendError: 'Не удалось отправить координаты на сервер.',
  },
  EN: {
    title: 'emergency Geolocation',
    subtitle: "Request the affected person's location by phone number",
    button: 'Request geolocation',
    creating: 'Creating request...',
    invalidPhone: 'Invalid phone format. The number must start with (+) country code',
    requestError: 'An error occurred while sending the request.',
    timerPrefix: 'Next request available in: ',
    sharingBanner: 'Waiting for the affected person\u2019s location…',
    mapHint: 'The affected person\u2019s location has been received',
    coordsPrefix: 'Coordinates: ',
    attachPhoto: 'Attach photo',
    sendPhoto: 'Send photo',
    sendingPhoto: 'Sending...',
    photoSent: 'Photos sent',
    invalidImage: 'File is not an image',
    invalidImageSub: 'Supported formats: JPG, PNG, WEBP, HEIC',
    tooMany: 'You can attach up to 20 photos',
    backHome: '← Back to home',
    footerDesc: 'emergency geodata sharing service',
    github: 'GitHub', contacts: 'Contacts', privacy: 'Privacy Policy',
    privacySoon: 'Document coming soon',
    privacyTitle: 'Privacy Policy',
    privacyBody: 'We only collect the data required to provide emergency assistance: phone number, location, and photos submitted by the affected person via the link. This data is shared with the service operator and is not used for any other purpose. The full document will appear here soon.',
    contactsTitle: 'Contacts',
    contactsBody: 'For any questions about the service, reach out to us:',
    close: 'Close',
    mapLoading: 'Detecting location…',
    geoDenied: 'Could not detect your location. Please allow location access.',
    sendError: 'Failed to send coordinates to the server.',
  },
  KZ: {
    title: 'emergency Geolocation',
    subtitle: 'Телефон нөмірі бойынша зардап шеккен адамның геолокациясын сұраңыз',
    button: 'Геолокацияны сұрау',
    creating: 'Сұрау жасалуда...',
    invalidPhone: 'Телефон нөмірінің форматы қате. Нөмір елдің (+) кодынан басталуы керек',
    requestError: 'Сұрауды жіберу кезінде қате орын алды.',
    timerPrefix: 'Келесі сұрауға дейін: ',
    sharingBanner: 'Зардап шеккен адамның геолокациясын күтудеміз…',
    mapHint: 'Зардап шеккен адамның геопозициясы алынды',
    coordsPrefix: 'Координаттар: ',
    attachPhoto: 'Фото тіркеу',
    sendPhoto: 'Фотоны жіберу',
    sendingPhoto: 'Жіберілуде...',
    photoSent: 'Фотолар жіберілді',
    invalidImage: 'Файл сурет емес',
    invalidImageSub: 'JPG, PNG, WEBP, HEIC форматтары қолдау көрсетіледі',
    tooMany: '20-дан артық фото тіркеуге болмайды',
    backHome: '← Басты бетке оралу',
    footerDesc: 'геодеректерді жедел жеткізу қызметі',
    github: 'GitHub', contacts: 'Байланыс', privacy: 'Құпиялылық саясаты',
    privacySoon: 'Құжат дайындалуда',
    privacyTitle: 'Құпиялылық саясаты',
    privacyBody: 'Біз тек шұғыл көмек көрсету үшін қажетті деректерді жинаймыз: телефон нөмірі, геолокация және зардап шеккен адам сілтеме арқылы жіберген фотосуреттер. Бұл деректер қызмет операторына беріледі және басқа мақсатта пайдаланылмайды. Толық құжат жақын арада осында пайда болады.',
    contactsTitle: 'Байланыс',
    contactsBody: 'Қызметтің жұмысы бойынша барлық сұрақтар үшін бізге жазыңыз:',
    close: 'Жабу',
    mapLoading: 'Геопозиция анықталуда…',
    geoDenied: 'Геопозицияны анықтау мүмкін болмады. Геолокацияға рұқсат беріңіз.',
    sendError: 'Координаттарды серверге жіберу мүмкін болмады.',
  },
};

export default function App() {
  const lon2tile = (lon, zoom) => Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const lat2tile = (lat, zoom) => Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'RU');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const t = T[lang];

  const [view, setView] = useState('main');
  const [phone, setPhone] = useState('');
  const [errorType, setErrorType] = useState(null);
  const [nextAvailableAt, setNextAvailableAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [creating, setCreating] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [sendingPhotos, setSendingPhotos] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#C23A2B');
  const [coords, setCoords] = useState(null);
  const [modal, setModal] = useState(null); // 'privacy' | 'contacts' | null

  const wsRef = useRef(null);
  let pressTimer;

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const chooseLang = (l) => {
    setLang(l);
    setLangOpen(false);
  };

  useEffect(() => {
    if (!nextAvailableAt) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [nextAvailableAt]);

  const remaining = nextAvailableAt ? Math.max(0, Math.ceil((nextAvailableAt - now) / 1000)) : 0;
  const isTimerActive = remaining > 0;
  const formatTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // 1. Create location share request on the backend
  const handleSubmit = async () => {
    if (isTimerActive || creating) return;
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^\+\d{7,15}$/.test(cleanPhone)) {
      setErrorType('invalidPhone');
      return;
    }
    setErrorType(null);
    setCreating(true);
    try {
      let data;
      if (USE_MOCK) {
        data = await mockApi.createLocationShareRequest(cleanPhone);
      } else {
        const res = await fetch(`${API_BASE}/location/location-shares`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanPhone }),
        });
        if (!res.ok) throw new Error('bad status');
        data = await res.json();
      }
      setRequestId(data.id);
      setNextAvailableAt(Date.now() + 137000);
      setView('sharing');
    } catch (e) {
      setErrorType('requestError');
    } finally {
      setCreating(false);
    }
  };

  const startPress = () => { pressTimer = setTimeout(() => setErrorType('requestError'), 800); };
  const endPress = () => clearTimeout(pressTimer);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('invalidImage'); return; }
    if (photos.length >= 20) { setPhotoError('tooMany'); return; }
    setPhotoError(null);
    setPhotos([...photos, { name: file.name, file }]);
  };

  // Оператор только создаёт заявку (бэкенд сам шлёт SMS/WhatsApp
  // на введённый номер) и ждёт, пока пострадавший откроет ссылку
  // на своём телефоне и сам поделится геопозицией.
  // Устройство оператора НИЧЕГО не отправляет само.
  useEffect(() => {
    if (view !== 'sharing' || !requestId || coords) return;

    if (USE_MOCK) {
      // имитация: как будто пострадавший поделился геопозицией через 4 сек
      const fake = setTimeout(() => {
        setCoords({ lat: 43.2385, lon: 76.9456 });
      }, 4000);
      return () => clearTimeout(fake);
    }

    const ws = new WebSocket(`${WS_BASE}/location/location-shares/ws/${requestId}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          setCoords({ lat: data.latitude, lon: data.longitude });
        }
      } catch (e) { /* ignore malformed messages */ }
    };
    ws.onerror = () => setErrorType('sendError');
    return () => ws.close();
  }, [view, requestId, coords]);

  // 4. Upload attached photos to the backend
  const handleSendPhotos = async () => {
    if (photos.length === 0 || !requestId || sendingPhotos) return;
    setSendingPhotos(true);
    try {
      for (const p of photos) {
        if (USE_MOCK) {
          await mockApi.uploadPhotoShare(requestId, p.file);
        } else {
          const formData = new FormData();
          formData.append('request_id', requestId);
          formData.append('photo', p.file);
          const res = await fetch(`${API_BASE}/photo/photo-shares`, {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) throw new Error('bad status');
        }
      }
      setPhotos([]);
      alert(t.photoSent);
    } catch (e) {
      setPhotoError('sendFail');
    } finally {
      setSendingPhotos(false);
    }
  };

  return (
    <div className="device">
      <div className="app-header">
        <div className="app-title">E-Geo</div>
        <div className="lang-wrap" ref={langRef}>
          <button className="lang-pill" onClick={() => setLangOpen(!langOpen)}>
            RU / EN / KZ ▾
          </button>
          {langOpen && (
            <div className="lang-menu">
              {['RU', 'EN', 'KZ'].map((l) => (
                <button
                  key={l}
                  className={`lang-option ${lang === l ? 'active' : ''}`}
                  onClick={() => chooseLang(l)}
                >{l}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {view === 'main' && (
        <div className="content">
          <div className="pin-icon" onPointerDown={startPress} onPointerUp={endPress} onPointerLeave={endPress}>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.5">
              <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <h1>{t.title}</h1>
          <div className="subtitle">{t.subtitle}</div>

          <input
            className="phone-input"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="+7 700 777 1111"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              color: '#1C1C1E',
              WebkitTextFillColor: '#1C1C1E',
              opacity: 1,
              caretColor: '#1C1C1E',
            }}
          />

          {errorType === 'invalidPhone' && <div className="msg-error">⚠ {t.invalidPhone}</div>}
          {errorType === 'requestError' && <div className="msg-error">⚠ {t.requestError}</div>}
          {isTimerActive && <div className="msg-timer">🕐 {t.timerPrefix}{formatTimer(remaining)}</div>}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isTimerActive || creating || phone.trim().length === 0}
          >
            {creating ? t.creating : t.button}
          </button>
        </div>
      )}

      {view === 'sharing' && (
        <>
          <div className="info-banner">📡 {t.sharingBanner}</div>

          <div className="map-box" style={{ position: 'relative' }}>
            {coords ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', width: '100%', height: '100%' }}>
                  {(() => {
                    const zoom = 16;
                    const xc = lon2tile(coords.lon, zoom);
                    const yc = lat2tile(coords.lat, zoom);
                    const tiles = [];
                    for (let dy = -1; dy <= 1; dy++) {
                      for (let dx = -1; dx <= 1; dx++) {
                        tiles.push(
                          <img
                            key={`${dx}-${dy}`}
                            src={`https://tile.openstreetmap.org/${zoom}/${xc + dx}/${yc + dy}.png`}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        );
                      }
                    }
                    return tiles;
                  })()}
                </div>
                <svg width="34" height="44" viewBox="0 0 24 30" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -95%)' }}>
                  <path d="M12 0C6 0 1 5 1 11c0 8 11 19 11 19s11-11 11-19C23 5 18 0 12 0z" fill={selectedColor} stroke="#fff" strokeWidth="1.5" />
                  <circle cx="12" cy="11" r="4" fill="#fff" />
                </svg>
                <div style={{ position: 'absolute', right: 4, bottom: 2, fontSize: 8, color: '#6B6B70', background: 'rgba(255,255,255,0.7)', padding: '1px 4px', borderRadius: 3 }}>
                  © OpenStreetMap
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6B6B70', fontSize: 13 }}>
                {t.mapLoading}
              </div>
            )}
          </div>
          <div className="map-hint">{t.mapHint}</div>
          {coords && (
            <div className="map-hint" style={{ fontFamily: 'monospace', marginTop: 4 }}>
              {t.coordsPrefix}{coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
            </div>
          )}
          {errorType === 'sendError' && <div className="photo-msg-error">⚠ {t.sendError}</div>}

          <div className="swatch-row">
            <label className="swatch-cam">
              📷
              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
            {['#A8C5E0', '#A8D5B0', '#EDE0A0', '#F0C4C0'].map((c) => (
              <button
                key={c}
                className={`swatch ${selectedColor === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>

          <label style={{ display: 'block' }}>
            <div className="btn-outline">{t.attachPhoto} ({photos.length})</div>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </label>
          <button className="btn-dark" onClick={handleSendPhotos} disabled={sendingPhotos}>
            {sendingPhotos ? t.sendingPhoto : t.sendPhoto}
          </button>

          {photoError === 'invalidImage' && <div className="photo-msg-error">⚠ {t.invalidImage}<br />{t.invalidImageSub}</div>}
          {photoError === 'tooMany' && <div className="photo-msg-error">⚠ {t.tooMany}</div>}
          {photoError === 'sendFail' && <div className="photo-msg-error">⚠ {t.requestError}</div>}

          <div className="back-row">
            <button
              className="btn-back"
              onClick={() => {
                setView('main');
                setPhotoError(null);
                setPhotos([]);
                setCoords(null);
                setRequestId(null);
                setErrorType(null);
                if (wsRef.current) wsRef.current.close();
              }}
            >{t.backHome}</button>
          </div>
        </>
      )}

      <div className="app-footer">
        <div className="fname">© 2026 Emergency Location</div>
        <div className="fsub">{t.footerDesc}</div>

        <a className="flink" href="https://github.com/smileBlueRose/emergency-location" target="_blank" rel="noreferrer">
          <span className="flink-icon">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </span>
          <span>{t.github}</span>
        </a>

        <button className="flink" onClick={() => setModal('contacts')}>
          <span className="flink-icon">
            <svg width="16" height="13" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="18" height="14" rx="2"/>
              <path d="M2 3l8 6 8-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>{t.contacts}</span>
        </button>

        <button className="flink" onClick={() => setModal('privacy')}>
          <span>{t.privacy}</span>
        </button>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {modal === 'privacy' ? t.privacyTitle : t.contactsTitle}
            </div>
            <div className="modal-body">
              {modal === 'privacy' ? t.privacyBody : (
                <>
                  {t.contactsBody}
                  <div style={{ marginTop: 10, fontWeight: 600 }}>
                    Telegram:{' '}
                    <a href="https://t.me/jemapellezhasmin" target="_blank" rel="noreferrer">@jemapellezhasmin</a>
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 600 }}>
                    Email: <a href="mailto:z_tursynova@kbtu.kz">z_tursynova@kbtu.kz</a>
                  </div>
                </>
              )}
            </div>
            <button className="btn-primary" style={{ marginTop: 16, marginBottom: 0 }} onClick={() => setModal(null)}>
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

