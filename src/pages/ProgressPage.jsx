import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './ProgressPage.css'

const CATEGORY_COLOURS = {
  Plastic: '#F0B429',
  Paper: '#378ADD',
  Glass: '#2D6A4F',
  Metal: '#E63946',
  'General Waste': '#1A1A1A',
}

function ProgressPage({ onNavigate, points, categoryCounts, onLogoClick }) {
  const badges = JSON.parse(localStorage.getItem('snapsort_badges') || '{}')

  const milestones = [
    { key: 'firstScan', label: 'First Scan', image: '/images/badges/firstScan.png' },
    { key: 'ten', label: '10 Items', image: '/images/badges/ten.png' },
    { key: 'twentyFive', label: '25 Items', image: '/images/badges/twentyFive.png' },
    { key: 'fifty', label: '50 Items', image: '/images/badges/fifty.png' },
  ]

  
  //pie chart data
  const pieData = Object.entries(categoryCounts || {})
    .filter(([, count]) => count > 0)
    .map(([category, count]) => ({
      name: category,
      value: count,
    }))

  const totalScans = Object.values(categoryCounts || {}).reduce((a, b) => a + b, 0)
  const recyclableCount = (categoryCounts?.Plastic || 0) +
    (categoryCounts?.Paper || 0) +
    (categoryCounts?.Glass || 0) +
    (categoryCounts?.Metal || 0)
  const recyclablePercent = totalScans > 0
    ? Math.round((recyclableCount / totalScans) * 100)
    : 0

  return (
    <div className="progress">

      <Header 
        points={points} 
        showBack={false}
        onBack={() => onNavigate('home')}
        onLogoClick={onLogoClick}
         />

      <div className="progress__content">

        

        <div className="progress__summary">
              <p className="progress__summary-label">your sorting knowledge</p>
              <p className="progress__summary-points">{points}</p>
              <p className="progress__summary-sub">items sorted correctly</p>
        </div>



        
        <div className="progress__stats-row">
            <div className="progress__stat">
              <p className="progress__stat-number">{totalScans}</p>
              <p className="progress__stat-label">total scans</p>
            </div>

            <div className="progress__stat-divider" />

            <div className="progress__stat">
              <p className="progress__stat-number">{recyclableCount}</p>
              <p className="progress__stat-label">recyclable</p>
            </div>

            <div className="progress__stat-divider" />

            <div className="progress__stat">
              <p className="progress__stat-number">{recyclablePercent}%</p>
              <p className="progress__stat-label">recycled</p>
            </div>
        </div>


        
        {pieData.length > 0 ? (
          <div className="progress__chart-card">
              <p className="progress__chart-title">Materials scanned</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLOURS[entry.name] || '#888'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} scans`, name]}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: 11, color: '#444' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
          </div>

        ) : (

          <div className="progress__chart-empty">
            <p>Scan some items to see your materials breakdown here.</p>
          </div>

        )}





        <div className="progressBadges">

            <p className="progress__badges-title">Milestone badges</p>

            <div className="progress__badges-grid">
              {milestones.map((milestone) => {
                const earned = badges[milestone.key]
                return (
                    <div
                      key={milestone.key}
                      className={`progress__badge ${earned ? 'progress__badge--earned' : 'progress__badge--locked'}`}
                    >
                      <img
                        src={milestone.image}
                        alt={milestone.label}
                        className="progress__badge-icon"
                      />
                      <p className="progress__badge-label">{milestone.label}</p>
                    </div>
                ) 
              })}
            </div>

        </div>



        
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