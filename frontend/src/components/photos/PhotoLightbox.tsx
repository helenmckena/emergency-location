import { useEffect, useRef } from 'react';

import { useLocale } from '../../app/providers/LocaleContext';

interface PhotoLightboxProps {
  url: string;
  onClose: () => void;
}

export function PhotoLightbox({
  url,
  onClose,
}: PhotoLightboxProps) {
  const { t } = useLocale();

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () =>
      document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // The page behind the overlay must not scroll away under it.
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="photo-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t.operator.photoFull}
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="photo-lightbox__close"
        aria-label={t.operator.closePhoto}
        onClick={onClose}
      >
        ×
      </button>

      <img
        src={url}
        alt={t.operator.photoFull}
        className="photo-lightbox__image"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
