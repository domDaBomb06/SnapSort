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
  const [scrollToReclaimers, setScrollToReclaimers] = useState(false)
  const { points, newBadge, addPoint, categoryCounts } = usePoints()

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

  function handleLogoClick() {
    setCurrentPage('home')
    setResult(null)
  }

  function handleGoToReclaimers() {
    setScrollToReclaimers(true)
    setCurrentPage('faq')
  }

  if (currentPage === null) return null

  return (
    <div style={{
      width: '100%',
      maxWidth: 430,
      height: '100%',
      minHeight: '100dvh',
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
          onGoToReclaimers={handleGoToReclaimers}
          onLogoClick={handleLogoClick}
        />
      )}

      {currentPage === 'home' && (
        <LandingPage
          onNavigate={handleNavigate}
          onGoToReclaimers={handleGoToReclaimers}
          onLogoClick={handleLogoClick}
        />
      )}

      {currentPage === 'scan' && (
        <ScanPage
          onNavigate={handleNavigate}
          onResult={handleResult}
          points={points}
          newBadge={newBadge}
          addPoint={addPoint}
          onLogoClick={handleLogoClick}
        />
      )}

      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onNavigate={handleNavigate}
          points={points}
          onLogoClick={handleLogoClick}
        />
      )}

      {currentPage === 'faq' && (
        <FAQPage
          onNavigate={handleNavigate}
          points={points}
          scrollToReclaimers={scrollToReclaimers}
          onScrollHandled={() => setScrollToReclaimers(false)}
          onLogoClick={handleLogoClick}
        />
      )}

      {currentPage === 'progress' && (
        <ProgressPage
          onNavigate={handleNavigate}
          points={points}
          categoryCounts={categoryCounts}
          onLogoClick={handleLogoClick}
        />
      )}

    </div>
  )
}

export default App