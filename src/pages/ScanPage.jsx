import { useEffect, useRef, useState } from 'react'
import * as tmImage from '@teachablemachine/image'
import { MODEL_URL, METADATA_URL } from '../constants'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import BadgeNotification from '../components/BadgeNotification'
import './ScanPage.css'

function ScanPage({ onNavigate, onResult, points, newBadge, addPoint }) {
  const videoRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [model, setModel] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load model
    useEffect(() => {
      let isMounted = true

      async function loadModel() {
        try {
          const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL)
          if (isMounted) {
            setModel(loadedModel)
          }
        } catch (err) {
          if (isMounted) {
            console.error('Error loading model:', err)
          }
        }
      }

      loadModel()

      return () => {
        isMounted = false
      }
    }, [])

  // Start camera
    useEffect(() => {
      let isMounted = true
      let currentStream = null

      async function startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          })
          currentStream = stream
          if (isMounted && videoRef.current) {
            videoRef.current.srcObject = stream
            setHasPermission(true)
          }
        } catch (err) {
          console.error('Camera error:', err)
          if (isMounted) {
            setHasPermission(false)
          }
        }
      }

      startCamera()

        return () => {
          isMounted = false
          if (currentStream) {
            currentStream.getTracks().forEach(track => {
              track.stop()
              track.enabled = false
            })
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null
            videoRef.current.load()
          }
        }
    }, [])

  async function handleCapture() {
    if (!model || !videoRef.current) return
    setIsLoading(true)

    try {
      const predictions = await model.predict(videoRef.current)
      const top = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      )

      // Only award a point if confidence is 60% or above
      if (top.probability >= 0.6) {
        addPoint()
      }

      onResult({
        label: top.className,
        confidence: top.probability,
      })
    } catch (err) {
      console.error('Prediction error:', err)
    }

    setIsLoading(false)
  }

  if (hasPermission === false) {
    return (
      <div className="scan">
        <Header points={points} showBack={true} onBack={() => onNavigate('home')} />
        <div className="scan__no-permission">
          <p>Camera access is required. Please allow camera permission and refresh the page.</p>
        </div>
        <BottomNav currentPage="scan" onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="scan">

      {/* Header */}
      <Header
        points={points}
        showBack={true}
        onBack={() => onNavigate('home')}
      />

      {/* Badge notification */}
      <BadgeNotification message={newBadge} />

      {/* Instruction */}
      <p className="scan__instruction">Place item in the frame</p>

      {/* Viewfinder */}
      <div className="scan__viewfinder">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="scan__video"
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="scan__loading-overlay">
            <div className="scan__spinner" />
            <span className="scan__loading-text">Identifying item...</span>
          </div>
        )}
      </div>

      {/* Capture button */}
      <div className="scan__capture-area">
        <button
          className="scan__capture-btn"
          onClick={handleCapture}
          disabled={isLoading || !model}
        >
          <img
            src="/images/logo/logoMark.svg"
            alt="scan"
            className="scan__capture-icon"
          />
        </button>
      </div>

      {/* Model loading hint */}
      {!model && (
        <p className="scan__loading-hint">loading model...</p>
      )}

      {/* Bottom nav */}
      <div className="scan__nav">
        <BottomNav currentPage="scan" onNavigate={onNavigate} />
      </div>

    </div>
  )
}

export default ScanPage