import { useLocation, Link } from 'react-router-dom'
import styles from './Error.module.css'

export default function ErrorPage() {
  const location = useLocation()

  const url = `${location.pathname}${location.search}${location.hash}`

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page not found</h1>
      <div className={styles.urlBox}>
        <span>Attempted URL:</span>
        <code>{url}</code>
      </div>
      <Link to="/" className={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  )
}
