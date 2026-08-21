import './Header.css'

function Header({ points, showPoints = true, showBack = false, onBack }) {
  return (
    <div className="header">

      {/* back button */}
      <div className="header__left">
        {showBack && (
          <button className="header__back-btn" onClick={onBack}>
            ‹
          </button>
        )}
      </div>

      {/* scan logo */}
      <img
        src="/images/logo/logo.png"
        alt="SnapSort logo"
        className="header__logo"
      />

      {/* points */}
      <div className="header__points">
        {showPoints && (
          <span>{points} pts</span>
        )}
      </div>

    </div>
  )
}

export default Header