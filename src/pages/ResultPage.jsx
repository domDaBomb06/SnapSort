import { binData } from '../data/binData'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './ResultPage.css'

function ResultPage({ result, onNavigate, points }) {
  const bin = binData[result.label]
  const confidence = result.confidence * 100
  const isLowConfidence = confidence < 60

  if (!bin) return null

  const binImageMap = {
    Paper: 'paper',
    Plastic: 'plastic',
    Glass: 'glass',
    Metal: 'metal',
    'General Waste': 'general-waste',
  }

  const binImageFile = binImageMap[result.label]
  const confidenceLabel = confidence < 40 ? 'low' : confidence < 70 ? 'medium' : 'high'
  const confidenceColour = isLowConfidence ? '#EF9F27' : '#2D6A4F'

  return (
    <div className="result">

      {/* Header */}
      <Header
        points={points}
        showBack={true}
        onBack={() => onNavigate('scan')}
      />

      {/* Scrollable content */}
      <div className="result__content">

        {/* Main result card */}
        <div className="result__card">



          {/* This item is */}
          <p className="result__this-item">This item is</p>

          {/* Material name in bin colour */}
          <h2
            className="result__material"
            style={{ color: bin.binColour }}
          >
            {result.label}
          </h2>

          {/* Bin label */}
          <p className="result__bin-label">
            This goes in the <strong>{bin.binLabel}</strong> bin
          </p>

          {/* Bin image */}
          <img
            src={`/images/bins/${binImageFile}.png`}
            alt={`${result.label} bin`}
            className="result__bin-img"
          />

          {/* Confidence bar */}
          <div className="result__confidence-row">
            <div className="result__confidence-labels">
              <span className="result__confidence-label">
                SnapSort AI confidence
              </span>
              <span
                className="result__confidence-label"
                style={{ color: confidenceColour }}
              >
                {confidenceLabel}
              </span>
            </div>
            <div className="result__confidence-track">
              <div
                className="result__confidence-fill"
                style={{
                  width: `${confidence}%`,
                  backgroundColor: confidenceColour,
                }}
              />
            </div>
          </div>


          {/* Low confidence banner */}
          {isLowConfidence && (
            <div className="result__low-confidence">
              <div>
                <p className="result__low-confidence-title">Not fully certain</p>
                <p className="result__low-confidence-sub">
                  Try a clearer photo or choose manually.
                </p>
              </div>
            </div>
          )}






        </div>

        {/* How to dispose card */}
        <div className="result__how-card">
          <p className="result__how-title">How to dispose:</p>
          <p className="result__how-text">{bin.instruction}</p>
        </div>

        {/* Reclaimer fact card */}
        <div className="result__reclaimer-card">
          <p className="result__reclaimer-title">Waste Reclaimer Fact:</p>
          <p className="result__reclaimer-text">{bin.reclaimerFact}</p>
        </div>


        {/* Sorting tip card */}
        <div className="sorting_tip-card">
          <p className="sorting_tip-title">When in doubt:</p>
          <p className="sorting_tip-text">{bin.sortingFact}</p>
        </div>

      </div>

      {/* Bottom nav */}
      <BottomNav currentPage="result" onNavigate={onNavigate} />

    </div>
  )
}

export default ResultPage