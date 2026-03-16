import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} Pet Store. All rights reserved.</p>
        <div className={styles.links}>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}
