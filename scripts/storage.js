export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load and parse JSON data safely
export function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Remove one key
export function clearData(key) {
  localStorage.removeItem(key);
}

// Clear all app data
export function clearAll() {
  localStorage.clear();
}
