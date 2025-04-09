export function setItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export function clearItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}

export function getItem(key: string) {
  try {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : '';
  } catch (error) {
    console.log(error);

    return null;
  }
}
