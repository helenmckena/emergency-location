import { useCallback, useEffect, useRef, useState } from 'react';
import { locationApi } from '../../services/api/location';
import { getCurrentPosition } from '../../services/geolocation';
import { create2GisGeoUrl } from '../../services/maps';
import { useLocale } from '../../app/providers/LocaleContext';

interface LocationSharingProps {
  requestId: number;
  autoTracking: boolean;
  onLocationReceived: (
    latitude: number,
    longitude: number,
  ) => void;
  onStatusChange: (status: LocationStatus) => void;
  onAutoTrackingChange: (
    autoTracking: boolean,
  ) => void;
}

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'sending'
  | 'success'
  | 'error';

// Refreshing on a timer (instead of navigator.geolocation.watchPosition)
// lets the device power down the GPS radio between fixes, which is
// noticeably lighter on battery than keeping it continuously active.
const LOCATION_REFRESH_INTERVAL_MS = 20_000;

export function LocationSharing({
  requestId,
  autoTracking,
  onLocationReceived,
  onStatusChange,
  onAutoTrackingChange,
}: LocationSharingProps) {
  const { t } = useLocale();

  const [status, setStatus] =
    useState<LocationStatus>('idle');

  const [mapUrl, setMapUrl] =
    useState<string | null>(null);

  // Kept in a ref so a re-render of the parent never re-arms the
  // refresh timer below and resets the 20 second cadence.
  const onLocationReceivedRef = useRef(onLocationReceived);

  useEffect(() => {
    onLocationReceivedRef.current = onLocationReceived;
  }, [onLocationReceived]);

  function updateStatus(nextStatus: LocationStatus) {
    setStatus(nextStatus);
    onStatusChange(nextStatus);
  }

  const refreshLocation = useCallback(async () => {
    const { latitude, longitude } =
      await getCurrentPosition({
        maximumAge: 5_000,
      });

    onLocationReceivedRef.current(latitude, longitude);

    setMapUrl(
      create2GisGeoUrl(
        latitude,
        longitude,
      ),
    );

    await locationApi.submitLocation(
      requestId,
      latitude,
      longitude,
    );
  }, [requestId]);

  async function handleShareLocation() {
    try {
      updateStatus('requesting');

      const { latitude, longitude } =
        await getCurrentPosition();

      onLocationReceivedRef.current(latitude, longitude);

      setMapUrl(
        create2GisGeoUrl(
          latitude,
          longitude,
        ),
      );

      updateStatus('sending');

      await locationApi.submitLocation(
        requestId,
        latitude,
        longitude,
      );

      updateStatus('success');
    } catch (error) {
      console.error(
        'Failed to share location:',
        error,
      );

      updateStatus('error');
    }
  }

  // A hand-placed marker wins over the automatic fix, so the timer is
  // only armed while the user keeps automatic tracking switched on.
  useEffect(() => {
    if (status !== 'success' || !autoTracking) {
      return;
    }

    const intervalId = window.setInterval(() => {
      refreshLocation().catch((error) => {
        console.error(
          'Failed to refresh location:',
          error,
        );
      });
    }, LOCATION_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [status, autoTracking, refreshLocation]);

  async function handleEnableAutoTracking() {
    onAutoTrackingChange(true);

    try {
      await refreshLocation();
    } catch (error) {
      console.error(
        'Failed to refresh location:',
        error,
      );
    }
  }

  return (
    <section className="location-sharing">
      <button
        type="button"
        onClick={handleShareLocation}
        disabled={
          status === 'requesting' ||
          status === 'sending'
        }
      >
        {status === 'requesting' &&
          t.location.requesting}

        {status === 'sending' &&
          t.location.sending}

        {status === 'idle' &&
          t.location.share}

        {status === 'success' &&
          t.location.success}

        {status === 'error' &&
          t.location.error}
      </button>

      {status === 'success' && !autoTracking && (
        <button
          type="button"
          className="location-sharing__auto"
          onClick={handleEnableAutoTracking}
        >
          {t.location.enableAutoTracking}
        </button>
      )}

      {mapUrl && status === 'success' && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t.location.open2gis}
        </a>
      )}
    </section>
  );
}
