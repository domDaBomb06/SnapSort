import { useEffect, useRef, useState } from 'react'
import * as tmImage from '@teachablemachine/image'
import { MODEL_URL, METADATA_URL } from '../constants'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import BadgeNotification from '../components/BadgeNotification'
import './ScanPage.css'

function ScanPage({ onNavigate, onResult, points, newBadge, addPoint, onLogoClick }) {
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
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

      if (top.probability >= 0.6) {
        addPoint(top.className)
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

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file || !model) return
    setIsLoading(true)

    try {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise((resolve) => { img.onload = resolve })

      const predictions = await model.predict(img)
      const top = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      )

      if (top.probability >= 0.6) {
        addPoint(top.className)
      }

      onResult({
        label: top.className,
        confidence: top.probability,
      })

      URL.revokeObjectURL(img.src)
    } catch (err) {
      console.error('Upload error:', err)
    }

    setIsLoading(false)
    e.target.value = ''
  }

  if (hasPermission === false) {
    return (
      <div className="scan">
        <Header
          points={points}
          showBack={true}
          onBack={() => onNavigate('home')}
          onLogoClick={onLogoClick}
        />
        <div className="scan__no-permission">
          <p>Camera access is required. Please allow camera permission and refresh the page.</p>
        </div>
        <BottomNav currentPage="scan" onNavigate={onNavigate} />
      </div>
    )
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

      
      
      <p className="scan__instruction">Place item in the frame</p>

      
      
      <div className="scan__viewfinder">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="scan__video"
        />

        
        
        {isLoading && (
          <div className="scan__loading-overlay">
            <div className="scan__spinner" />
            <span className="scan__loading-text">Identifying item...</span>
          </div>
        )}
      </div>

      
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      
      
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

      
      
      {!model && (
        <p className="scan__loading-hint">loading model...</p>
      )}

      
      
      {model && (
        <div className="scan__gallery-area">
          <button
            className="scan__gallery-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading}
          >
            upload from gallery
          </button>
          <p className="scan__gallery-note">
            your photos are never stored or uploaded
          </p>
        </div>
      )}

      {/* Bottom nav */}
      <div className="scan__nav">
        <BottomNav currentPage="scan" onNavigate={onNavigate} />
      </div>

    </div>
  )
}

export default ScanPage