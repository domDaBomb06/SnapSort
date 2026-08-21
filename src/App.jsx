import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import ScanPage from './pages/ScanPage'
import ResultPage from './pages/ResultPage'
import { usePoints } from './hooks/usePoints'
import FAQPage from './pages/FAQPage'
import ProgressPage from './pages/ProgressPage'


function App() {
  const [currentPage, setCurrentPage] = useState(null)
  const [result, setResult] = useState(null)
  const { points, newBadge, addPoint } = usePoints()

  // Check if user has been onboarded
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('snapsort_onboarded')
    if (hasOnboarded) {
      setCurrentPage('home')
    } else {
      setCurrentPage('landing')
    }
  }, [])

  function handleNavigate(page) {
    setCurrentPage(page)
    setResult(null)
  }

  function handleResult(resultData) {
    setResult(resultData)
    setCurrentPage('result')
  }

  function handleLandingComplete() {
    localStorage.setItem('snapsort_onboarded', 'true')
    setCurrentPage('home')
  }

  // Still checking localStorage
  if (currentPage === null) return null

  return (
    <div style={{
      width: '100%',
      maxWidth: 430,
      minHeight: '100vh',
      margin: '0 auto',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {currentPage === 'landing' && (
        <LandingPage
          onNavigate={(page) => {
            if (page === 'scan') {
              handleLandingComplete()
              setCurrentPage('scan')
            } else {
              handleNavigate(page)
            }
          }}
        />
      )}

      {currentPage === 'home' && (
        <LandingPage
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'scan' && (
        <ScanPage
          onNavigate={handleNavigate}
          onResult={handleResult}
          points={points}
          newBadge={newBadge}
          addPoint={addPoint}
        />
      )}

      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onNavigate={handleNavigate}
          points={points}
        />
      )}

      {currentPage === 'faq' && (
        <FAQPage
          onNavigate={handleNavigate}
          points={points}
        />
      )}

      {currentPage === 'progress' && (
        <ProgressPage
          onNavigate={handleNavigate}
          points={points}
        />
      )}


    </div>
  )
}

export default App