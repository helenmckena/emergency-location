import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  useLocation as useRouterLocation,
  useParams,
} from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPanel } from '../../components/map/MapPanel';
import { useLocale } from '../../app/providers/LocaleContext';
import { locationApi } from '../../services/api/location';
import { photoApi } from '../../services/api/photo';
import { connectLocationSocket } from '../../services/websocket/locationSocket';
import { connectPhotoSocket } from '../../services/websocket/photoSocket';
import { resolveMediaUrl } from '../../services/media';
import { DEMO_MODE } from '../../services/demo';
import { PhotoLightbox } from '../../components/photos/PhotoLightbox';
import {
  ExternalLinkIcon,
  TelegramIcon,
  WhatsAppIcon,
} from '../../components/ui/icons';

import type { Photo } from '../../types';

export function OperatorRequestPage() {
  const { t } = useLocale();

  const { requestId } = useParams<{
    requestId: string;
  }>();

  const numericRequestId = Number(requestId);

  // Номер передаётся со страницы создания заявки (после перезагрузки его нет).
  const routerLocation = useRouterLocation();
  const phone =
    (routerLocation.state as { phone?: string } | null)?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');

  // Ссылка для пострадавшего: оператор отправляет её сам, это бесплатно.
  const victimLink = `${window.location.origin}/request/${numericRequestId}`;
  const shareText = `Экстренная служба. Откройте ссылку и отправьте своё местоположение: ${victimLink}`;
  const telegramHref = phoneDigits
    ? `https://t.me/+${phoneDigits}`
    : `https://t.me/share/url?url=${encodeURIComponent(victimLink)}&text=${encodeURIComponent('Отправьте своё местоположение')}`;
  const whatsappHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(shareText)}`;
  const smsHref = `sms:${phoneDigits ? `+${phoneDigits}` : ''}?&body=${encodeURIComponent(shareText)}`;

  const [hint, setHint] = useState('');

  function copyToClipboard(text: string, message: string) {
    void navigator.clipboard
      .writeText(text)
      .then(() => setHint(message))
      .catch(() => setHint(''));
  }

  const [location, setLocation] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  const [photos, setPhotos] =
    useState<Photo[]>([]);

  const [openedPhotoUrl, setOpenedPhotoUrl] =
    useState<string | null>(null);

  // Nothing is fetched for a malformed id, so the page starts out
  // already loaded instead of flipping the flag from an effect.
  const [loading, setLoading] =
    useState(() =>
      Number.isInteger(numericRequestId),
    );

  useEffect(() => {
    if (!Number.isInteger(numericRequestId)) {
      return;
    }

    async function loadRequest() {
      try {
        const [
          latestLocation,
          photoList,
        ] = await Promise.all([
          locationApi.getLatestLocation(
            numericRequestId,
          ),
          photoApi.getAll(
            numericRequestId,
          ),
        ]);

        if (latestLocation) {
          setLocation({
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
          });
        }

        setPhotos(photoList.items);
      } catch (error) {
        console.error(
          'Failed to load operator request:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    void loadRequest();
  }, [numericRequestId]);

  useEffect(() => {
    if (!Number.isInteger(numericRequestId)) {
      return;
    }

    return connectLocationSocket(
      numericRequestId,
      (message) => {
        setLocation({
          latitude: message.latitude,
          longitude: message.longitude,
        });
      },
    );
  }, [numericRequestId]);

  useEffect(() => {
    if (!Number.isInteger(numericRequestId)) {
      return;
    }

    return connectPhotoSocket(
      numericRequestId,
      (message) => {
        const newPhoto: Photo = {
          id: message.id,
          url: resolveMediaUrl(
            message.url,
          ),
        };

        setPhotos((currentPhotos) => {
          const alreadyExists =
            currentPhotos.some(
              (photo) =>
                photo.id === newPhoto.id,
            );

          if (alreadyExists) {
            return currentPhotos;
          }

          return [
            ...currentPhotos,
            newPhoto,
          ];
        });
      },
    );
  }, [numericRequestId]);

  const locationReceived =
    location !== null;

  return (
    <div className="page operator-request-page">
      <Header />

      <main className="operator-request">
        <section className="operator-request__main-card">
          <header className="operator-request__header">
            <h1>
              {t.operator.request} #{requestId}
            </h1>

            <span className="operator-request__status">
              {loading
                ? t.operator.locationWaiting
                : locationReceived
                  ? t.operator.locationReceived
                  : t.operator.locationWaiting}
            </span>
          </header>

          {DEMO_MODE && (
            <p className="demo-banner">
              Демо-режим: данные хранятся только в этом браузере, сервер отключён.{' '}
              <a
                href={`/request/${numericRequestId}`}
                target="_blank"
                rel="noreferrer"
              >
                Открыть страницу пострадавшего
              </a>{' '}
              (в новой вкладке) и поделиться геопозицией.
            </p>
          )}

          <div className="operator-request__map">
            <MapPanel
              latitude={
                location?.latitude ?? null
              }
              longitude={
                location?.longitude ?? null
              }
            />

            {loading && !location && (
              <div className="operator-request__map-loading">
                <span
                  className="operator-request__spinner"
                  aria-hidden="true"
                />
                Loading...
              </div>
            )}
          </div>

          <div className="operator-request__victim">
            <QRCodeSVG value={victimLink} size={112} />

            <div>
              <strong>Ссылка для пострадавшего</strong>
              <p className="operator-request__victim-link">{victimLink}</p>
              <p className="operator-request__victim-note">
                Если сообщение не пришло, наведите камеру телефона на QR-код
                или откройте ссылку:
                {' '}
                <a href={victimLink} target="_blank" rel="noreferrer">
                  открыть
                </a>
              </p>
            </div>
          </div>

          <div className="operator-request__share">
            <span>
              {t.operator.shareData}
            </span>

            <div className="operator-request__share-actions">
              <a
                href={telegramHref}
                target="_blank"
                rel="noreferrer"
                className="share-button share-button--telegram"
                onClick={() =>
                  copyToClipboard(
                    shareText,
                    'Сообщение со ссылкой скопировано. Вставьте его в чат Telegram и отправьте.',
                  )
                }
              >
                <TelegramIcon className="share-button__icon" />
                Telegram
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="share-button share-button--whatsapp"
              >
                <WhatsAppIcon className="share-button__icon" />
                WhatsApp
              </a>

              <a
                href={smsHref}
                className="share-button share-button--copy"
              >
                <ExternalLinkIcon className="share-button__icon" />
                SMS
              </a>

              <button
                type="button"
                className="share-button share-button--copy"
                onClick={() =>
                  copyToClipboard(victimLink, 'Ссылка для пострадавшего скопирована.')
                }
              >
                <ExternalLinkIcon className="share-button__icon" />
                {t.operator.copyLink}
              </button>
            </div>

            {hint && (
              <p className="operator-request__hint">{hint}</p>
            )}
          </div>
        </section>

        <aside className="operator-request__photo-panel">
          <h2>
            {t.operator.photos}
          </h2>

          {photos.length === 0 ? (
            <div className="operator-request__photo-placeholder operator-request__photo-placeholder--blue">
              {t.operator.photosWaiting}
            </div>
          ) : (
            <div className="operator-request__photos">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  className="operator-request__photo-button"
                  aria-label={t.operator.openPhoto}
                  onClick={() =>
                    setOpenedPhotoUrl(photo.url)
                  }
                >
                  <img
                    src={photo.url}
                    alt={t.operator.photos}
                    className="operator-request__photo"
                    onError={(event) => {
                      console.error(
                        'Failed to load photo:',
                        photo.url,
                      );

                      const tile =
                        event.currentTarget.closest(
                          'button',
                        );

                      (
                        tile ?? event.currentTarget
                      ).style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </aside>
      </main>

      {openedPhotoUrl && (
        <PhotoLightbox
          url={openedPhotoUrl}
          onClose={() => setOpenedPhotoUrl(null)}
        />
      )}

      <Footer />
    </div>
  );
}