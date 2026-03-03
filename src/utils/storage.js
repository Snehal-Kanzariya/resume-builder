const KEY = 'resumeData';

export function saveToStorage(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save resume to localStorage:', e);
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load resume from localStorage:', e);
    return null;
  }
}

export function clearStorage() {
  localStorage.removeItem(KEY);
}
