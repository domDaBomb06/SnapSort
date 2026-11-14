import { readJSON, writeJSON } from './storage'

const STORAGE_KEY = 'snapsort_feedback'
const MAX_ENTRIES = 200 

// Each entry: { time, predicted, confidence (percent), rating ('up' | 'down'),
// corrected (a category name, or null) }
//
// If an entry with the same time already exists (for example a thumbs down followed by a correction), it is replaced rather than duplicated.
export function saveFeedback(entry) {
  const saved = readJSON(STORAGE_KEY, [])
  const log = Array.isArray(saved) ? saved : []
  const others = log.filter((item) => item.time !== entry.time)
  return writeJSON(STORAGE_KEY, [...others, entry].slice(-MAX_ENTRIES))
}