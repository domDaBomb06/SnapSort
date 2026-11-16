import { Component } from 'react'
import { clearSavedData } from '../utils/storage'
import './ErrorBoundary.css'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('SnapSort crashed:', error, info.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    clearSavedData()
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="error-boundary" role="alert">
        <h1 className="error-boundary__title">Something went wrong</h1>
        <p className="error-boundary__text">
          SnapSort hit a problem it couldn't recover from. Reloading usually fixes it.
        </p>
        <button className="error-boundary__btn" onClick={this.handleReload}>
          Reload SnapSort
        </button>
        <p className="error-boundary__text">
          If it keeps happening, you can clear what SnapSort has saved on this
          device (your points, badges and feedback) and start fresh.
        </p>
        <button
          className="error-boundary__btn error-boundary__btn--secondary"
          onClick={this.handleReset}
        >
          Clear saved data and reload
        </button>
      </div>
    )
  }
}

export default ErrorBoundary