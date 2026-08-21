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

  // Load from localStorage on first render
  useEffect(() => {
    const savedPoints = localStorage.getItem('snapsort_points')
    const savedBadges = localStorage.getItem('snapsort_badges')
    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedBadges) setBadges(JSON.parse(savedBadges))
  }, [])

  function addPoint() {
    const newPoints = points + 1
    setPoints(newPoints)
    localStorage.setItem('snapsort_points', newPoints)
    checkBadges(newPoints)
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

  return { points, badges, newBadge, addPoint }
}