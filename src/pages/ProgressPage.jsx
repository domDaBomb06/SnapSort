import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './ProgressPage.css'

function ProgressPage({ onNavigate, points }) {
  const badges = JSON.parse(localStorage.getItem('snapsort_badges') || '{}')

const milestones = [
  { key: 'firstScan', label: 'First Scan', image: '/images/badges/firstScan.png' },
  { key: 'ten', label: '10 Items', image: '/images/badges/ten.png' },
  { key: 'twentyFive', label: '25 Items', image: '/images/badges/twentyFive.png' },
  { key: 'fifty', label: '50 Items', image: '/images/badges/fifty.png' },
]

  return (
    <div className="progress">

      <Header points={points} showBack={false} />

      <div className="progress__content">

        {/* Points summary */}
        <div className="progress__summary">
          <p className="progress__summary-label">your sorting knowledge</p>
          <p className="progress__summary-points">{points}</p>
          <p className="progress__summary-sub">items sorted correctly</p>
          <div className="progress__collective">
          </div>
        </div>

        {/* Badges title */}
        <p className="progress__badges-title">Milestone badges</p>

        {/* Badges grid */}
        <div className="progress__badges-grid">
          {milestones.map((milestone) => {
            const earned = badges[milestone.key]
            return (
              <div
                key={milestone.key}
                className={`progress__badge ${earned ? 'progress__badge--earned' : 'progress__badge--locked'}`}
              >
                <span className="progress__badge-icon">
                  {earned ? milestone.icon : '🔒'}
                </span>
                <p className="progress__badge-label">{milestone.label}</p>
              </div>
            )
          })}
        </div>

        {/* Tip */}
        <div className="progress__tip">
          <p>
            <span>Tip:</span> Scan more items to unlock badges and build your sorting knowledge. Every correct scan makes a difference on campus.
          </p>
        </div>

      </div>

      <BottomNav currentPage="progress" onNavigate={onNavigate} />

    </div>
  )
}

export default ProgressPage