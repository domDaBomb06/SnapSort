import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

function ProgressPage({ onNavigate, points }) {
  const badges = JSON.parse(localStorage.getItem('snapsort_badges') || '{}')

  const milestones = [
    { key: 'firstScan', label: 'First Scan', icon: '🌱', target: 1 },
    { key: 'ten', label: '10 Items', icon: '⭐', target: 10 },
    { key: 'twentyFive', label: '25 Items', icon: '🌿', target: 25 },
    { key: 'fifty', label: '50 Items', icon: '🏆', target: 50 },
  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      backgroundColor: 'white',
      overflow: 'hidden',
    }}>

      <Header points={points} showBack={false} />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 20px',
      }}>

        {/* Points summary */}
        <div style={{
          backgroundColor: '#2D6A4F',
          borderRadius: 20,
          padding: '24px 20px',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            margin: '0 0 8px',
          }}>
            your sorting knowledge
          </p>
          <p style={{
            color: 'white',
            fontSize: 48,
            fontWeight: 700,
            margin: '0 0 4px',
            lineHeight: 1,
          }}>
            {points}
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            margin: '0 0 16px',
          }}>
            items sorted correctly
          </p>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '8px 12px',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              margin: 0,
            }}>
              🌍 Wits campus: helping one scan at a time
            </p>
          </div>
        </div>

        {/* Milestone badges */}
        <p style={{
          color: '#1A1A1A',
          fontSize: 15,
          fontWeight: 600,
          margin: '0 0 16px',
        }}>
          Milestone badges
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {milestones.map((milestone) => {
            const earned = badges[milestone.key]
            return (
              <div
                key={milestone.key}
                style={{
                  backgroundColor: earned ? '#2D6A4F' : '#f7f4ef',
                  borderRadius: 16,
                  padding: '16px 12px',
                  textAlign: 'center',
                  border: earned ? 'none' : '1px solid #e6ddd0',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {earned ? milestone.icon : '🔒'}
                </div>
                <p style={{
                  color: earned ? 'white' : '#888',
                  fontSize: 13,
                  fontWeight: 500,
                  margin: 0,
                }}>
                  {milestone.label}
                </p>
              </div>
            )
          })}
        </div>

      </div>

      <BottomNav currentPage="progress" onNavigate={onNavigate} />

    </div>
  )
}

export default ProgressPage