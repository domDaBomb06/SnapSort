import { useEffect, useRef, useState } from 'react'
import { loadModel } from '../utils/modelLoader'
import { CONFIDENCE_THRESHOLD } from '../constants'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import BadgeNotification from '../components/BadgeNotification'
import './ScanPage.css'

const PREDICTION_ERROR = 'Something went wrong while identifying that item. Please try again.'

// Resolves once the browser has painted, so the "Identifying item..." overlay is on screen before the heavy prediction work starts.
const nextPaint = () =>
  new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))

// Opens an uploaded file as an image. Resolves with null (instead of waiting forever) if the file can't be read as an image.
function readImage(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

function ScanPage({ onNavigate, onResult, points, newBadge, addPoint, onLogoClick }) {
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [videoReady, setVideoReady] = useState(false)
  const [model, setModel] = useState(null)
  const [modelFailed, setModelFailed] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [nudge, setNudge] = useState(0)

  // Both the model and the camera must be ready before a scan can run so the user doesn't waste time tapping the button before the app is ready.
  const isReady = Boolean(model) && videoReady

  // Get the model (it is loaded once and shared, see utils/modelLoader.js)
  useEffect(() => {
    let isMounted = true

    loadModel()
      .then((loadedModel) => {
        if (isMounted) setModel(loadedModel)
      })
      .catch((err) => {
        console.error('Error loading model:', err)
        if (isMounted) setModelFailed(true)
      })

    return () => {
      isMounted = false
    }
  }, [loadAttempt])

  // Start the camera
  useEffect(() => {
    let isMounted = true
    let stream = null
    const video = videoRef.current

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        if (!isMounted) {
          // The user left the page while the camera was starting: release it straight away (now the scary camera light won't stay on hehe)
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }

        stream = mediaStream
        if (video) video.srcObject = mediaStream
        setHasPermission(true)
      } catch (err) {
        console.error('Camera error:', err)
        if (isMounted) setHasPermission(false)
      }
    }

    startCamera()

    return () => {
      isMounted = false
      if (stream) stream.getTracks().forEach((track) => track.stop())
      if (video) video.srcObject = null
    }
  }, [])

  function handleRetryModel() {
    setModelFailed(false)
    setLoadAttempt((attempt) => attempt + 1)
  }

  // Runs the model on a video frame or an image, then hands the result to the app
  async function classify(source) {
    const start = performance.now()
    const predictions = await model.predict(source)
    console.info(`[SnapSort] prediction took ${Math.round(performance.now() - start)} ms`)

    const top = predictions.reduce((a, b) => (a.probability > b.probability ? a : b))

    if (top.probability >= CONFIDENCE_THRESHOLD) {
      addPoint(top.className)
    }

    onResult({
      label: top.className,
      confidence: top.probability,
    })
  }

  async function handleCapture() {
    const video = videoRef.current
    if (isLoading) return

    // Not ready yet: wiggle the status message so a tap never feels ignored
    if (!isReady || !video) {
      setNudge((count) => count + 1)
      return
    }

    setErrorMessage(null)
    setIsLoading(true)

    try {
      await nextPaint()
      await classify(video)
    } catch (err) {
      console.error('Prediction error:', err)
      setErrorMessage(PREDICTION_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same photo be chosen again
    if (!file || !model) return

    setErrorMessage(null)

    if (file.type && !file.type.startsWith('image/')) {
      setErrorMessage('That file is not a photo. Please choose a JPG or PNG image.')
      return
    }

    setIsLoading(true)

    try {
      const img = await readImage(file)
      if (!img) {
        setErrorMessage("That photo couldn't be opened. Please try a different JPG or PNG image.")
        return
      }

      await nextPaint()
      await classify(img)
    } catch (err) {
      console.error('Upload error:', err)
      setErrorMessage(PREDICTION_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  // Work out which message (if any) to show over the camera
  let overlay = null
  if (errorMessage) {
    overlay = {
      text: errorMessage,
      buttonLabel: 'OK',
      onClick: () => setErrorMessage(null),
    }
  } else if (modelFailed) {
    overlay = {
      text: "SnapSort couldn't load its AI model. Check your connection and try again.",
      buttonLabel: 'Try again',
      onClick: handleRetryModel,
    }
  } else if (hasPermission === false) {
    overlay = {
      text: "SnapSort can't use your camera. Allow camera access in your browser settings and refresh the page, or upload a photo instead.",
    }
  }

  // Tells the user what the page is waiting for
  let statusText = ''
  if (!model && !modelFailed) {
    statusText = 'Getting ready...'
  } else if (model && hasPermission !== false && !videoReady) {
    statusText = 'Starting camera...'
  }

  return (
    <div className="scan">

      <Header
        points={points}
        showBack={true}
        onBack={() => onNavigate('home')}
        onLogoClick={onLogoClick}
      />

      <BadgeNotification message={newBadge} />

      <div className="scan__body">

            <p className="scan__instruction">Place item in the frame</p>


            <div className="scan__viewfinder">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="scan__video"
                onPlaying={() => setVideoReady(true)}
              />

                  {isLoading && (
                    <div className="scan__loading-overlay" role="status">
                      <div className="scan__spinner" />
                      <span className="scan__loading-text">Identifying item...</span>
                    </div>
                  )}
                  {overlay && !isLoading && (
                    <div className="scan__error-overlay" role="alert">
                      <p className="scan__error-text">{overlay.text}</p>
                      {overlay.buttonLabel && (
                        <button className="scan__error-btn" onClick={overlay.onClick}>
                          {overlay.buttonLabel}
                        </button>
                      )}
                    </div>
                  )}
            </div>


            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              hidden
            />

                <div className="scan__capture-area">
                  <button
                    className="scan__capture-btn"
                    onClick={handleCapture}
                    disabled={isLoading}
                    aria-disabled={!isReady}
                    aria-label="Scan item"
                  >
                    <img
                      src="/images/logo/logoMark.svg"
                      alt=""
                      className="scan__capture-icon"
                    />
                  </button>
                </div>

                {statusText && (
                  <p
                    key={nudge}
                    className={`scan__loading-hint ${nudge > 0 ? 'scan__loading-hint--nudge' : ''}`}
                    role="status"
                  >
                    {statusText}
                  </p>
                )}

                {model && (
                    <div className="scan__gallery-area">
                      <button
                        className="scan__gallery-btn"
                        onClick={() => fileInputRef.current.click()}
                        disabled={isLoading || !model}
                      >
                        Upload from gallery
                      </button>
                      <p className="scan__gallery-note">
                        Your photos are never stored or uploaded
                      </p>
                    </div>
                )}


          </div>


          <div className="scan__nav">
            <BottomNav
              currentPage="scan"
              onNavigate={onNavigate}
              onCameraClick={handleCapture}
            />
          </div>

    </div>
  )
}

export default ScanPage