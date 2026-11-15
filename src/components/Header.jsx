import './Header.css'

function Header({ points, showPoints = true, showBack = false, onBack, onLogoClick }) {
  const logo = (
    <img
      src="/images/logo/logo.png"
      alt={onLogoClick ? '' : 'Back to Instructions'}
      className="header__logo"
    />
  )

  return (
    <header className="header">

      <div className="header__left">
        {showBack && (
          <button
            className="header__back-btn"
            onClick={onBack}
            aria-label="Go to the home screen"
          >
            <span aria-hidden="true">⌂</span>
          </button>
        )}
      </div>

      {/* A button when the logo goes somewhere, a plain image when it doesn't */}
      {onLogoClick ? (
        <button
          className="header__logo-btn"
          onClick={onLogoClick}
          aria-label="SnapSort home"
        >
          {logo}
        </button>
      ) : (
        logo
      )}

      <div className="header__points">
        {showPoints && (
          <span>{points} pts</span>
        )}
      </div>

    </header>
  )
}

export default Header