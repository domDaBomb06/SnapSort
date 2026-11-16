import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ScanPage from './pages/ScanPage'
import ResultPage from './pages/ResultPage'
import FAQPage from './pages/FAQPage'
import ProgressPage from './pages/ProgressPage'
import EvalPage from './pages/EvalPage'
import ErrorBoundary from './components/ErrorBoundary'
import { usePoints } from './hooks/usePoints'
import { readJSON, writeJSON } from './utils/storage'

function AppContent() {
  // Returning visitors skip the landing screen. Decided up front, so no effect is needed.
  const [currentPage, setCurrentPage] = useState(() =>
    readJSON('snapsort_onboarded', false) === true ? 'home' : 'landing'
  )
  const [result, setResult] = useState(null)
  const [scrollToReclaimers, setScrollToReclaimers] = useState(false)
  const { points, badges, newBadge, addPoint, categoryCounts } = usePoints()

  function handleNavigate(page) {
    setCurrentPage(page)
    setResult(null)
  }

  function handleResult(resultData) {
    setResult(resultData)
    setCurrentPage('result')
  }

  function handleLandingComplete() {
    writeJSON('snapsort_onboarded', true)
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
          badges={badges}
          onLogoClick={handleLogoClick}
        />
      )}
    </div>
  )
}

function App() {
  // Developer tool: open the app at /#eval to run the accuracy test
  const showAccuracyTest = window.location.hash === '#eval'

  return (
    <ErrorBoundary>
      {showAccuracyTest ? <EvalPage /> : <AppContent />}
    </ErrorBoundary>
  )
}

export default App