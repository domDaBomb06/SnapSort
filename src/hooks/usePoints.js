import { useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

const POINTS_KEY = 'snapsort_points'
const BADGES_KEY = 'snapsort_badges'
const CATEGORIES_KEY = 'snapsort_categories'

const CATEGORY_NAMES = ['Plastic', 'Paper', 'Glass', 'Metal', 'General Waste']

const BADGES = [
  { key: 'firstScan', needed: 1, message: '🎉 First Scan!' },
  { key: 'ten', needed: 10, message: '⭐ 10 Items Sorted!' },
  { key: 'twentyFive', needed: 25, message: '🌿 25 Items Sorted!' },
  { key: 'fifty', needed: 50, message: '🏆 50 Items Sorted!' },
]

const isCount = (value) => Number.isInteger(value) && value >= 0

// Reading saved data: anything missing, damaged or the wrong shape
// falls back to a safe default instead of crashing.
function loadPoints() {
  const saved = readJSON(POINTS_KEY, 0)
  return isCount(saved) ? saved : 0
}

function loadCategoryCounts() {
  const saved = readJSON(CATEGORIES_KEY, null)
  const counts = {}
  CATEGORY_NAMES.forEach((name) => {
    const value = saved?.[name]
    counts[name] = isCount(value) ? value : 0
  })
  return counts
}

// A badge counts as earned if it was saved as earned,
// or if the points total has already reached it.
function loadBadges(points) {
  const saved = readJSON(BADGES_KEY, null)
  const badges = {}
  BADGES.forEach(({ key, needed }) => {
    badges[key] = saved?.[key] === true || points >= needed
  })
  return badges
}

export function usePoints() {
  // Saved values are read once, as the starting state (no effect needed)
  const [points, setPoints] = useState(loadPoints)
  const [badges, setBadges] = useState(() => loadBadges(points))
  const [categoryCounts, setCategoryCounts] = useState(loadCategoryCounts)
  const [newBadge, setNewBadge] = useState(null)

  function addPoint(category) {
    const newPoints = points + 1
    setPoints(newPoints)
    writeJSON(POINTS_KEY, newPoints)

    if (CATEGORY_NAMES.includes(category)) {
      const updatedCounts = { ...categoryCounts, [category]: categoryCounts[category] + 1 }
      setCategoryCounts(updatedCounts)
      writeJSON(CATEGORIES_KEY, updatedCounts)
    }

    const earned = BADGES.filter(({ key, needed }) => !badges[key] && newPoints >= needed)
    if (earned.length > 0) {
      const updatedBadges = { ...badges }
      earned.forEach(({ key }) => {
        updatedBadges[key] = true
      })
      setBadges(updatedBadges)
      writeJSON(BADGES_KEY, updatedBadges)
      setNewBadge(earned[earned.length - 1].message)
      setTimeout(() => setNewBadge(null), 3000)
    }
  }

  return { points, badges, newBadge, categoryCounts, addPoint }
}