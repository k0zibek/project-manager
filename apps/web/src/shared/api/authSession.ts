type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registers callback invoked when API returns 401 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

/** Notifies app that session is invalid */
export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
