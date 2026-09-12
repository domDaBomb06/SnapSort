import { useState, useEffect } from 'react'

export function usePoints() {
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState({
    firstScan: false,
    ten: false,
    twentyFive: false,
    fifty: false,
  })
  const [newBadge, setNewBadge] = useState(null)
  const [categoryCounts, setCategoryCounts] = useState({
    Plastic: 0,
    Paper: 0,
    Glass: 0,
    Metal: 0,
    'General Waste': 0,
  })

  // Load from localStorage on first render
  useEffect(() => {
    const savedPoints = localStorage.getItem('snapsort_points')
    const savedBadges = localStorage.getItem('snapsort_badges')
    const savedCounts = localStorage.getItem('snapsort_categories')
    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedBadges) setBadges(JSON.parse(savedBadges))
    if (savedCounts) setCategoryCounts(JSON.parse(savedCounts))
  }, [])

  function addPoint(category) {
    const newPoints = points + 1
    setPoints(newPoints)
    localStorage.setItem('snapsort_points', newPoints)
    checkBadges(newPoints)
    trackCategory(category)
  }

  function trackCategory(category) {
    if (!category) return
    const updatedCounts = {
      ...categoryCounts,
      [category]: (categoryCounts[category] || 0) + 1,
    }
    setCategoryCounts(updatedCounts)
    localStorage.setItem('snapsort_categories', JSON.stringify(updatedCounts))
  }

  function checkBadges(currentPoints) {
    const updatedBadges = { ...badges }
    let earned = null

    if (currentPoints >= 1 && !updatedBadges.firstScan) {
      updatedBadges.firstScan = true
      earned = '🎉 First Scan!'
    } else if (currentPoints >= 10 && !updatedBadges.ten) {
      updatedBadges.ten = true
      earned = '⭐ 10 Items Sorted!'
    } else if (currentPoints >= 25 && !updatedBadges.twentyFive) {
      updatedBadges.twentyFive = true
      earned = '🌿 25 Items Sorted!'
    } else if (currentPoints >= 50 && !updatedBadges.fifty) {
      updatedBadges.fifty = true
      earned = '🏆 50 Items Sorted!'
    }

    if (earned) {
      setBadges(updatedBadges)
      localStorage.setItem('snapsort_badges', JSON.stringify(updatedBadges))
      setNewBadge(earned)
      setTimeout(() => setNewBadge(null), 3000)
    }
  }

  return { points, badges, newBadge, categoryCounts, addPoint }
}