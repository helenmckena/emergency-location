export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function getCurrentPosition(
  options: PositionOptions = {},
): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 0,
        ...options,
      },
    );
  });
}