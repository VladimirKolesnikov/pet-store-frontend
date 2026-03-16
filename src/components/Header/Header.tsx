import { Link } from 'react-router-dom'
import { ShoppingBag, Menu, User } from 'lucide-react'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/favicon.png" alt="Pet Store Logo" className={styles.logoImage} />
          <span>Pet Store</span>
        </Link>

        {/* Categories Button */}
        <button className={styles.categoriesBtn}>
          <Menu className={styles.icon} size={20} />
          <span>Categories</span>
        </button>

        <div className={styles.spacer} />

        {/* Right Actions */}
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <ShoppingBag className={styles.icon} size={24} />
          </button>
          
          <Link to="/login" className={styles.loginBtn}>
            <User className={styles.icon} size={20} />
            <span>Login / Sign up</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
