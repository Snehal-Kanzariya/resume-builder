const KEY = 'resumeData';

export function saveToStorage(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded — resume not saved.');
      // Dispatch a custom event so UI layers can show a toast
      window.dispatchEvent(new CustomEvent('storage-quota-exceeded'));
    } else {
      console.warn('Failed to save resume to localStorage:', e);
    }
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
