import { useEffect, useState } from 'react';
import axios from 'axios';

import { locationApi } from '../../services/api/location';
import {
  isValidPhone,
  normalizePhone,
} from '../../services/phone';
import { useLocale } from '../../app/providers/LocaleContext';
import { AlertCircleIcon, ClockIcon } from '../ui/icons';

interface RequestFormProps {
  onRequestCreated: (requestId: number, phone: string) => void;
}

const DEFAULT_COOLDOWN_SECONDS = 137;

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function RequestForm({
  onRequestCreated,
}: RequestFormProps) {
  const { t } = useLocale();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [cooldownEndAt, setCooldownEndAt] =
    useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!cooldownEndAt) {
      return;
    }

    function tick() {
      const secondsLeft = Math.max(
        0,
        Math.ceil(((cooldownEndAt ?? 0) - Date.now()) / 1000),
      );

      setRemainingSeconds(secondsLeft);

      if (secondsLeft <= 0) {
        setCooldownEndAt(null);
      }
    }

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, [cooldownEndAt]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      return;
    }

    if (!isValidPhone(trimmedPhone)) {
      setInvalidPhone(true);
      setError(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      setInvalidPhone(false);

      const request =
        await locationApi.createShareRequest(
          normalizePhone(trimmedPhone),
        );

      onRequestCreated(
        request.id,
        request.phone,
      );
    } catch (requestError) {
      console.error(
        'Failed to create request:',
        requestError,
      );

      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 429
      ) {
        const retryAfterHeader =
          requestError.response.headers?.['retry-after'];

        const retryAfterSeconds = Number(retryAfterHeader);

        const cooldownSeconds =
          Number.isFinite(retryAfterSeconds) &&
          retryAfterSeconds > 0
            ? retryAfterSeconds
            : DEFAULT_COOLDOWN_SECONDS;

        setCooldownEndAt(Date.now() + cooldownSeconds * 1000);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const isCoolingDown = cooldownEndAt !== null;

  return (
    <form
      className="request-form"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="request-phone"
        className="request-form__label sr-only"
      >
        {t.request.phone}
      </label>

      <input
        id="request-phone"
        type="tel"
        value={phone}
        onChange={(event) => {
          setPhone(event.target.value);
          setInvalidPhone(false);
          setError(false);
        }}
        placeholder="+7 700 777 1111"
        className="request-form__input"
        disabled={loading || isCoolingDown}
      />

      <button
        type="submit"
        className="request-form__button"
        disabled={
          loading || isCoolingDown || !phone.trim()
        }
      >
        {loading
          ? t.request.creating
          : t.request.create}
      </button>

      {invalidPhone && (
        <p className="request-form__error">
          <AlertCircleIcon className="request-form__message-icon" />
          {t.request.invalidPhone}
        </p>
      )}

      {error && !invalidPhone && (
        <p className="request-form__error">
          <AlertCircleIcon className="request-form__message-icon" />
          {t.request.error}
        </p>
      )}

      {isCoolingDown && (
        <p className="request-form__timer">
          <ClockIcon className="request-form__message-icon" />
          {t.request.nextRequestPrefix}{' '}
          {formatCountdown(remainingSeconds)}
        </p>
      )}
    </form>
  );
}
