import './BottomNav.css'

function BottomNav({ currentPage, onNavigate }) {
  return (
    <div className="bottom-nav">


      <button
        className="bottom-nav__btn"
        onClick={() => onNavigate('faq')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`bottom-nav__icon ${currentPage === 'faq' ? 'bottom-nav__icon--active' : ''}`}
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      
      <button
        className="bottom-nav__camera-btn"
        onClick={() => onNavigate('scan')}
      >
        <img
          src="/images/logo/logoMark.svg"
          alt="scan"
          className="bottom-nav__camera-icon"
        />
      </button>

      
      <button
        className="bottom-nav__btn"
        onClick={() => onNavigate('progress')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`bottom-nav__icon ${currentPage === 'progress' ? 'bottom-nav__icon--active' : ''}`}
        >
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

    </div>
  )
}

export default BottomNav