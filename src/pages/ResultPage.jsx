import { useRef, useState } from 'react'
import { binData } from '../data/binData'
import { CONFIDENCE_THRESHOLD, UNRECOGNISED_THRESHOLD } from '../constants'
import { saveFeedback } from '../utils/feedbackLog'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './ResultPage.css'

const binImageMap = {
  Paper: 'paper',
  Plastic: 'plastic',
  Glass: 'glass',
  Metal: 'metal',
  'General Waste': 'general-waste',
}

const CATEGORIES = Object.keys(binImageMap)

function ResultPage({ result, onNavigate, points, onLogoClick }) {
  const [rating, setRating] = useState(null) // null, 'up' or 'down'
  const [chosenLabel, setChosenLabel] = useState(null) // the category the user picked
  const feedbackTime = useRef(null) // identifies this scan's feedback entry

  const confidence = result.confidence * 100
  const isLowConfidence = result.confidence < CONFIDENCE_THRESHOLD
  const isUnrecognised = !binData[result.label] || result.confidence < UNRECOGNISED_THRESHOLD

  // Show the user's choice if they made one, otherwise SnapSort's guess
  const displayLabel = chosenLabel ?? result.label
  const bin = binData[displayLabel]
  const showResult = Boolean(bin) && (Boolean(chosenLabel) || !isUnrecognised)
  const showPicker = isLowConfidence || isUnrecognised || rating === 'down'
  const feedbackGiven = Boolean(chosenLabel) || rating !== null

  const confidenceLabel = confidence < 40 ? 'low' : confidence < 70 ? 'medium' : 'high'
  const confidenceColour = isLowConfidence ? '#EF9F27' : '#2D6A4F'

  // Saves (or updates) this scan's feedback entry. Only labels and numbers are
  // saved, never the photo.
  function recordFeedback(newRating, corrected) {
    if (!feedbackTime.current) feedbackTime.current = new Date().toISOString()
    saveFeedback({
      time: feedbackTime.current,
      predicted: result.label,
      confidence: Math.round(confidence),
      rating: newRating,
      corrected,
    })
  }

  function handleRating(newRating) {
    setRating(newRating)
    recordFeedback(newRating, null)
  }

  function handleChoose(label) {
    setChosenLabel(label)
    const agrees = label === result.label
    recordFeedback(agrees ? 'up' : 'down', agrees ? null : label)
  }

  return (
    <div className="result">

      <Header
        points={points}
        showBack={true}
        onBack={() => onNavigate('scan')}
        onLogoClick={onLogoClick}
      />

      <div className="result__content">

        <div className="result__card">
          {showResult ? (
            <>
              <p className="result__this-item">
                {chosenLabel ? 'You chose' : 'This item is'}
              </p>

              <h2 className="result__material" style={{ color: bin.headingColour ?? bin.binColour }}>
                {displayLabel}
              </h2>

              <p className="result__bin-label">
                This goes in the <strong>{bin.binLabel}</strong> bin
              </p>

              <img
                src={`/images/bins/${binImageMap[displayLabel]}.png`}
                alt={`${displayLabel} bin`}
                className="result__bin-img"
              />

              {chosenLabel ? (
                <p className="result__chosen-note">
                  SnapSort guessed {result.label} ({Math.round(confidence)}% sure). You chose {chosenLabel}.
                </p>
              ) : (
                <div className="result__confidence-row">
                  <div className="result__confidence-labels">
                    <span className="result__confidence-label">
                      SnapSort AI confidence
                    </span>

                    
                    <span className="result__confidence-label">
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
              )}

              {isLowConfidence && !chosenLabel && (
                <div className="result__low-confidence">
                  <div>
                    <p className="result__low-confidence-title">Not fully certain</p>
                    <p className="result__low-confidence-sub">
                      Try a clearer photo, or choose the category below.
                    </p>
                  </div>
                </div>
              )}

              <div className="result__feedback">
                {feedbackGiven ? (
                  <p className="result__feedback-note" role="status">
                    Thanks, noted.
                  </p>
                ) : (
                  <>
                    <p className="result__feedback-question">Was SnapSort right?</p>
                    <div className="result__feedback-buttons">
                      <button
                        className="result__feedback-btn"
                        onClick={() => handleRating('up')}
                        aria-label="Yes, SnapSort was right"
                      >
                        <span aria-hidden="true">👍</span> Yes
                      </button>
                      <button
                        className="result__feedback-btn"
                        onClick={() => handleRating('down')}
                        aria-label="No, SnapSort was wrong"
                      >
                        <span aria-hidden="true">👎</span> No
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="result__this-item">SnapSort could not tell what this is</p>

              <h2 className="result__material result__material--unknown">
                Item not recognised
              </h2>

              <p className="result__bin-label">
                Check the label on the bin, or choose a category below.
              </p>

              <button className="result__link-btn" onClick={() => onNavigate('faq')}>
                Search the Waste Guide
              </button>
            </>
          )}
        </div>

        {showPicker && (
          <div
            className="result__picker"
            role="group"
            aria-labelledby="result-picker-heading"
          >
            <p className="result__picker-heading" id="result-picker-heading">
              {rating === 'down' ? 'What was it?' : 'Choose the category yourself:'}
            </p>
            <div className="result__picker-grid">
              {CATEGORIES.map((label) => (
                <button
                  key={label}
                  className={`result__picker-btn ${chosenLabel === label ? 'result__picker-btn--chosen' : ''}`}
                  onClick={() => handleChoose(label)}
                  aria-pressed={chosenLabel === label}
                >
                  <span
                    className="result__picker-dot"
                    style={{ backgroundColor: binData[label]?.binColour }}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showResult && (
          <>
            <div className="result__how-card">
              <p className="result__how-title">How to dispose:</p>
              <p className="result__how-text">{bin.instruction}</p>
            </div>

            <div className="result__reclaimer-card">
              <p className="result__reclaimer-title">Waste Reclaimer Fact:</p>
              <p className="result__reclaimer-text">{bin.reclaimerFact}</p>
            </div>

            {bin.sortingFact && (
              <div className="sorting_tip-card">
                <p className="sorting_tip-title">When in doubt:</p>
                <p className="sorting_tip-text">{bin.sortingFact}</p>
              </div>
            )}
          </>
        )}

      </div>

      <BottomNav currentPage="result" onNavigate={onNavigate} />

    </div>
  )
}

export default ResultPage