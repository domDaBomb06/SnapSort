import './BottomNav.css'

function BottomNav({ currentPage, onNavigate, onCameraClick }) {
  return (
    <nav className="bottom-nav" aria-label="Main">

      <button
        className={`bottom-nav__btn ${currentPage === 'faq' ? 'bottom-nav__btn--active' : ''}`}
        onClick={() => onNavigate('faq')}
        aria-current={currentPage === 'faq' ? 'page' : undefined}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="bottom-nav__icon"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="bottom-nav__label"> Waste Guide</span>
      </button>

      <button
        className="bottom-nav__camera-btn"
        onClick={() => (onCameraClick ? onCameraClick() : onNavigate('scan'))}
        aria-label="Scan an item"
      >
        <img
          src="/images/logo/logoMark.svg"
          alt=""
          className="bottom-nav__camera-icon"
        />
      </button>

      <button
        className={`bottom-nav__btn ${currentPage === 'progress' ? 'bottom-nav__btn--active' : ''}`}
        onClick={() => onNavigate('progress')}
        aria-current={currentPage === 'progress' ? 'page' : undefined}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="bottom-nav__icon"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="bottom-nav__label">Progress</span>
      </button>

    </nav>
  )
}

export default BottomNav