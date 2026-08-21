import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './LandingPage.css'

function LandingPage({ onNavigate }) {
  return (
    <div className="landing">

      {/* Header */}
      <Header showPoints={false} showBack={false} />

      {/* Scrollable content */}
      <div className="landing__content">

        {/* Greeting */}
        <h1 className="landing__greeting">Hello there!</h1>

        {/* Logo */}
        <img
          src="/images/logo/landingLogo.png"
          alt="SnapSort"
          className="landing__logo"
        />

        {/* Tagline */}
        <p className="landing__tagline-bold">
          Ready to make the{' '}
          <span>Smart</span>
          {' '}choice?
        </p>
        <p className="landing__tagline-sub">
          Sort your waste correctly,<br />every time.
        </p>

        {/* Bin images row */}
        <div className="landing__bins-row">
          {['general-waste', 'paper', 'glass', 'metal', 'plastic'].map((bin) => (
            <img
              key={bin}
              src={`/images/bins/${bin}.png`}
              alt={bin}
              className="landing__bin-img"
            />
          ))}
        </div>

        {/* Snap it tagline */}
        <p className="landing__snap-tagline">Snap it. Sort it. Done.</p>

        {/* How it works card */}
        <div className="landing__how-card">
          <p className="landing__how-title">How it works:</p>
          {[
            '1. Click the camera icon',
            '2. Point your camera at a waste item',
            '3. AI will identify the material instantly',
            '4. Learn which bin to use on campus',
          ].map((step, i) => (
            <p key={i} className="landing__how-step">{step}</p>
          ))}
        </div>

        {/* Privacy note */}
        <p className="landing__privacy">No account needed · nothing stored</p>

      </div>

      {/* Bottom nav */}
      <BottomNav currentPage="home" onNavigate={onNavigate} />

    </div>
  )
}

export default LandingPage