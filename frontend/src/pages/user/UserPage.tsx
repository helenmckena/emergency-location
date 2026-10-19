import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPanel } from '../../components/map/MapPanel';
import {
  LocationSharing,
  type LocationStatus,
} from '../../components/location/LocationSharing';
import { PhotoUploader } from '../../components/photos/PhotoUploader';
import { useLocale } from '../../app/providers/LocaleContext';
import { locationApi } from '../../services/api/location';
import { BroadcastIcon } from '../../components/ui/icons';

export function UserPage() {
  const { t } = useLocale();

  const { requestId: requestIdParam } =
    useParams<{ requestId: string }>();

  const requestId = Number(requestIdParam);

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>('idle');

  const [autoTracking, setAutoTracking] =
    useState(true);

  function handleMarkerDragEnd(
    lat: number,
    lon: number,
  ) {
    setLatitude(lat);
    setLongitude(lon);

    // A marker the user placed by hand takes priority: automatic
    // refreshes stop until they explicitly ask for them again.
    setAutoTracking(false);

    if (Number.isInteger(requestId)) {
      void locationApi.submitLocation(
        requestId,
        lat,
        lon,
      );
    }
  }

  if (!Number.isInteger(requestId)) {
    return (
      <div className="page">
        <Header />

        <main className="user-page">
          <section className="user-page__status user-page__status--error">
            {t.location.error}
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="user-page">
        {locationStatus === 'success' && (
          <section className="user-page__status">
            <BroadcastIcon className="user-page__status-icon" />
            {t.location.shared}
          </section>
        )}

        {locationStatus === 'requesting' && (
          <section className="user-page__status">
            {t.location.requesting}
          </section>
        )}

        {locationStatus === 'sending' && (
          <section className="user-page__status">
            {t.location.sending}
          </section>
        )}

        {locationStatus === 'error' && (
          <section className="user-page__status user-page__status--error">
            {t.location.error}
          </section>
        )}

        <MapPanel
          latitude={latitude}
          longitude={longitude}
          draggableMarker={locationStatus === 'success'}
          onMarkerDragEnd={handleMarkerDragEnd}
        />

        {locationStatus === 'success' && (
          <p className="user-page__drag-hint">
            {autoTracking
              ? t.location.dragHint
              : t.location.manualPin}
          </p>
        )}

        <LocationSharing
          requestId={requestId}
          autoTracking={autoTracking}
          onLocationReceived={(lat, lon) => {
            setLatitude(lat);
            setLongitude(lon);
          }}
          onStatusChange={setLocationStatus}
          onAutoTrackingChange={setAutoTracking}
        />

        <PhotoUploader
          requestId={requestId}
        />
      </main>

      <Footer />
    </div>
  );
}