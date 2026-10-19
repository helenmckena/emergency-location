import { describe, expect, it, vi } from 'vitest';

import { resolveMediaUrl } from './media';

const API_URL = 'https://emergency-location.com';

describe('resolveMediaUrl', () => {
  it('adds a scheme to the bare domain the backend returns', () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    expect(
      resolveMediaUrl('emergency-location.com/media/1/photo.jpg'),
    ).toBe('https://emergency-location.com/media/1/photo.jpg');
  });

  it('leaves an already absolute url untouched', () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    expect(
      resolveMediaUrl('https://cdn.example.com/media/photo.jpg'),
    ).toBe('https://cdn.example.com/media/photo.jpg');
  });

  it('rewrites a localhost url onto the configured api origin', () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    expect(
      resolveMediaUrl('http://localhost:8080/media/1/photo.jpg'),
    ).toBe('https://emergency-location.com/media/1/photo.jpg');
  });

  it('rewrites a 0.0.0.0 url and keeps the query string', () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    expect(
      resolveMediaUrl('http://0.0.0.0:8080/media/1/photo.jpg?v=2'),
    ).toBe('https://emergency-location.com/media/1/photo.jpg?v=2');
  });

  it('returns the input unchanged when it cannot be parsed', () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    expect(resolveMediaUrl('')).toBe('');
  });
});
