import { useRef, useState } from 'react';

import { photoApi } from '../../services/api/photo';
import { isCameraPermissionDenied } from '../../services/camera';
import { useLocale } from '../../app/providers/LocaleContext';
import { CameraPlusIcon, FileWarningIcon } from '../ui/icons';

interface PhotoUploaderProps {
  requestId: number;
}

type PhotoStatus = 'pending' | 'uploading' | 'success' | 'error';

interface QueuedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  status: PhotoStatus;
}

const MAX_PHOTOS = 20;
const PLACEHOLDER_TONES = ['blue', 'green', 'yellow', 'pink'] as const;

export function PhotoUploader({
  requestId,
}: PhotoUploaderProps) {
  const { t } = useLocale();

  const [photos, setPhotos] = useState<QueuedPhoto[]>([]);
  const [formatError, setFormatError] = useState(false);
  const [countError, setCountError] = useState(false);
  const [sending, setSending] = useState(false);
  const [cameraBlocked, setCameraBlocked] = useState(false);

  // Two separate inputs: the camera one carries `capture`, which is what
  // makes a phone open the camera (and ask for access to it) instead of
  // the gallery. Desktop browsers ignore `capture` and show a file dialog.
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function handleTakePhoto() {
    setCameraBlocked(false);

    if (await isCameraPermissionDenied()) {
      setCameraBlocked(true);
      return;
    }

    cameraInputRef.current?.click();
  }

  function handlePickFromGallery() {
    setCameraBlocked(false);
    galleryInputRef.current?.click();
  }

  function handleFilesSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (selected.length === 0) {
      return;
    }

    setFormatError(false);
    setCountError(false);

    const imageFiles = selected.filter((file) =>
      file.type.startsWith('image/'),
    );

    if (imageFiles.length < selected.length) {
      setFormatError(true);
    }

    setPhotos((current) => {
      const availableSlots = Math.max(
        MAX_PHOTOS - current.length,
        0,
      );

      if (imageFiles.length > availableSlots) {
        setCountError(true);
      }

      const accepted = imageFiles.slice(0, availableSlots);

      const queued: QueuedPhoto[] = accepted.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending',
      }));

      return [...current, ...queued];
    });
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((photo) => photo.id !== id);
    });
  }

  async function handleSendAll() {
    const pending = photos.filter(
      (photo) => photo.status !== 'success',
    );

    if (pending.length === 0) {
      return;
    }

    setSending(true);

    for (const photo of pending) {
      setPhotos((current) =>
        current.map((item) =>
          item.id === photo.id
            ? { ...item, status: 'uploading' }
            : item,
        ),
      );

      try {
        await photoApi.upload(requestId, photo.file);

        setPhotos((current) =>
          current.map((item) =>
            item.id === photo.id
              ? { ...item, status: 'success' }
              : item,
          ),
        );
      } catch (error) {
        console.error(
          'Failed to upload photo:',
          error,
        );

        setPhotos((current) =>
          current.map((item) =>
            item.id === photo.id
              ? { ...item, status: 'error' }
              : item,
          ),
        );
      }
    }

    setSending(false);
  }

  const hasPendingUploads = photos.some(
    (photo) => photo.status !== 'success',
  );

  const hasErrors = photos.some(
    (photo) => photo.status === 'error',
  );

  return (
    <section className="photo-uploader">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFilesSelected}
        className="photo-uploader__input"
        tabIndex={-1}
        aria-hidden="true"
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className="photo-uploader__input"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="photo-uploader__grid">
        <button
          type="button"
          className="photo-uploader__tile photo-uploader__tile--add"
          onClick={handleTakePhoto}
          aria-label={t.photo.takePhoto}
          title={t.photo.takePhoto}
        >
          <CameraPlusIcon className="photo-uploader__add-icon" />
        </button>

        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-uploader__tile"
            data-tone={
              PLACEHOLDER_TONES[
                index % PLACEHOLDER_TONES.length
              ]
            }
            data-status={photo.status}
          >
            <img
              src={photo.previewUrl}
              alt={t.photo.preview}
            />

            {photo.status === 'success' && (
              <span className="photo-uploader__tile-badge">
                ✓
              </span>
            )}

            {photo.status !== 'uploading' && (
              <button
                type="button"
                className="photo-uploader__remove"
                aria-label={t.photo.remove}
                onClick={() => removePhoto(photo.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {formatError && (
        <div className="photo-uploader__notice">
          <FileWarningIcon className="photo-uploader__notice-icon" />

          <div>
            <p>{t.photo.invalidFile}</p>
            <p className="photo-uploader__notice-hint">
              {t.photo.supportedFormats}
            </p>
          </div>
        </div>
      )}

      {countError && (
        <div className="photo-uploader__notice">
          <FileWarningIcon className="photo-uploader__notice-icon" />
          <p>{t.photo.tooMany}</p>
        </div>
      )}

      {cameraBlocked && (
        <div className="photo-uploader__notice">
          <FileWarningIcon className="photo-uploader__notice-icon" />
          <p>{t.photo.cameraBlocked}</p>
        </div>
      )}

      <button
        type="button"
        className="photo-uploader__button"
        onClick={handleTakePhoto}
      >
        {t.photo.takePhoto}
      </button>

      <button
        type="button"
        className="photo-uploader__button"
        onClick={handlePickFromGallery}
      >
        {t.photo.attach}
      </button>

      <button
        type="button"
        className="photo-uploader__send"
        onClick={handleSendAll}
        disabled={
          photos.length === 0 ||
          !hasPendingUploads ||
          sending
        }
      >
        {sending
          ? t.photo.sending
          : t.photo.send}
      </button>

      {hasErrors && (
        <p className="photo-uploader__status photo-uploader__status--error">
          {t.photo.error}
        </p>
      )}

      {photos.length > 0 &&
        !hasPendingUploads &&
        !sending && (
          <p className="photo-uploader__status">
            {t.photo.success}
          </p>
        )}
    </section>
  );
}
