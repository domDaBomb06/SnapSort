import './BadgeNotification.css'

function BadgeNotification({ message }) {
  if (!message) return null

  return (
    <div className="badge-notification">
      {message}
    </div>
  )
}

export default BadgeNotification