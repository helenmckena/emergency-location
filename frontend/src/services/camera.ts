// Only Chromium exposes the camera through the Permissions API. Everywhere
// else the check is inconclusive, and we let the file input open so the OS
// can ask for access itself.
export async function isCameraPermissionDenied(): Promise<boolean> {
  const permissions = navigator.permissions;

  if (!permissions?.query) {
    return false;
  }

  try {
    const status = await permissions.query({
      name: 'camera' as PermissionName,
    });

    return status.state === 'denied';
  } catch {
    return false;
  }
}
