import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

function FAQPage({ onNavigate, points }) {
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
      }}>
        <div style={{
          fontSize: 48,
        }}>
          🔍
        </div>
        <h2 style={{
          color: '#2D6A4F',
          fontSize: 20,
          fontWeight: 700,
          margin: 0,
          textAlign: 'center',
        }}>
          FAQ
        </h2>
        <p style={{
          color: '#888',
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 1.6,
          margin: 0,
        }}>
          A searchable guide to common campus waste items and which bin they belong in is coming soon.
        </p>
        <div style={{
          backgroundColor: '#f7f4ef',
          borderRadius: 12,
          padding: '12px 20px',
          border: '1px solid #e6ddd0',
        }}>
          <p style={{
            color: '#2D6A4F',
            fontSize: 13,
            fontWeight: 500,
            margin: 0,
            textAlign: 'center',
          }}>
            Coming in the next update
          </p>
        </div>
      </div>

      <BottomNav currentPage="faq" onNavigate={onNavigate} />

    </div>
  )
}

export default FAQPage