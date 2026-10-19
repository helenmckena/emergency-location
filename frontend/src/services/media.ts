export function resolveMediaUrl(url: string) {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  // The backend sometimes returns bare domains without a scheme
  // (e.g. "emergency-location.com/media/…"), which `URL` can't parse.
  const absoluteUrl = /^https?:\/\//.test(url)
    ? url
    : `https://${url}`;

  try {
    const parsedUrl = new URL(absoluteUrl);

    if (
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '0.0.0.0'
    ) {
      const apiOrigin =
        new URL(apiUrl).origin;

      return `${apiOrigin}${parsedUrl.pathname}${parsedUrl.search}`;
    }

    return parsedUrl.toString();
  } catch {
    return url;
  }
}