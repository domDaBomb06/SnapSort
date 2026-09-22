import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './LandingPage.css'

function LandingPage({ onNavigate, onGoToReclaimers }) {
  return (
    <div className="landing">

      <Header showPoints={false} showBack={false} />

      <div className="landing__content">

        <h1 className="landing__greeting">Hello there!</h1>

        <img
          src="/images/logo/landingLogo.png"
          alt="SnapSort"
          className="landing__logo"
        />

        <p className="landing__tagline-bold">
          Ready to make the{' '}
          <span>Smart</span>
          {' '}choice?
        </p>
        <p className="landing__tagline-sub">
          Sort your waste correctly,<br />every time.
        </p>

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

        <p className="landing__snap-tagline">Snap it. Sort it. Done.</p>

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


        
        <div className="landing__purpose-card">
          <p className="landing__purpose-title">Why does this matter?</p>
          <p className="landing__purpose-text">
            Sorting waste correctly is one of the simplest ways to make a difference on campus. When recyclables are properly sorted, waste reclaimers can work more safely and efficiently — turning your small action into real impact.
          </p>
          <button
            className="landing__purpose-btn"
            onClick={onGoToReclaimers}
          >
            Learn about waste reclaimers →
          </button>
        </div>


      </div>








      {/* Bottom nav */}
      <BottomNav currentPage="home" onNavigate={onNavigate} />

    </div>
  )
}

export default LandingPage