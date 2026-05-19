/** Persists JSON-serializable values in localStorage */
export function setItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function getItem(key: string) {
  try {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : '';
  } catch {
    return null;
  }
}
