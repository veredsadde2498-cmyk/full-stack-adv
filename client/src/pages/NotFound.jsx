import { Link } from 'react-router-dom'

// עמוד 404 - מוצג כשהנתיב לא תואם לאף route מוכר
function NotFound() {
  return (
    <div className="main-container" dir="rtl">
      <h2>404 - העמוד לא נמצא</h2>
      <div style={{ marginTop: '15px' }}>
        <Link
          to="/login"
          style={{ background: 'transparent', color: '#007bff', border: 'none', cursor: 'pointer' }}
        >
          חזרה להתחברות
        </Link>
      </div>
    </div>
  )
}

export default NotFound
