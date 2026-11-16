//this is to help fix the blank screen of death when the gallery upload doesnt work
// Safe wrappers around localStorage. If saved data is missing, corrupted, or storage is blocked, they return a fallback instead of crashing the app.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Removes everything SnapSort has saved on this device (every key starting with "snapsort_")
export function clearSavedData() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('snapsort_'))
      .forEach((key) => localStorage.removeItem(key))
    return true
  } catch {
    return false
  }
}