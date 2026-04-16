import { useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Menu,
  User,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import styles from './Header.module.css'
import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../../api/category.service'
import { cartService } from '../../api/cart.service'
import { useAuth } from '../../context/AuthContext'
import type { Category } from '../../types/category'

export function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const { user, isAuthenticated, logout } = useAuth()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['cat-menu'],
    queryFn: () => categoryService.getChildren(),
  })

  const { data: cartItems } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  })
  const cartItemCount = isAuthenticated
    ? cartItems?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
    : 0

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const toggleCategory = (id: number) => {
    const newExpandedIds = new Set(expandedIds)
    if (newExpandedIds.has(id)) {
      newExpandedIds.delete(id)
    } else {
      newExpandedIds.add(id)
    }
    setExpandedIds(newExpandedIds)
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedIds.has(category.id)
    const hasChildren = category.children && category.children.length > 0

    return (
      <div
        key={category.id}
        className={styles.categoryItem}
        style={{ '--level': level } as CSSProperties}
      >
        <div className={styles.categoryHeader}>
          <Link
            to={`/categories/${category.slug}`}
            className={styles.categoryLink}
            onClick={() => setIsMenuOpen(false)}
          >
            {category.name}
          </Link>
          {hasChildren && (
            <button
              className={styles.expandBtn}
              onClick={() => toggleCategory(category.id)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.categoryChildren}>
            {category.children!.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img
            src="/favicon.png"
            alt="Pet Store Logo"
            className={styles.logoImage}
          />
          <span>Pet Store</span>
        </Link>

        {/* Categories Button */}
        <div className={styles.categoriesWrapper}>
          <button
            className={`${styles.categoriesBtn} ${isMenuOpen ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className={styles.icon} size={20} />
            <span>Categories</span>
          </button>

          {isMenuOpen && (
            <div className={styles.categoriesDropdown}>
              <div className={styles.categoriesList}>
                {isLoading ? (
                  <div style={{ padding: '1rem', textAlign: 'center' }}>
                    Loading categories...
                  </div>
                ) : (
                  categories.map((cat) => renderCategory(cat))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.spacer} />

        {/* Right Actions */}
        <div className={styles.actions}>
          {isAuthenticated && user && (
            <span className={styles.userEmail}>{user.email}</span>
          )}

          {isAuthenticated && (
            <Link to="/cart" className={styles.actionBtn}>
              <div className={styles.cartIconWrapper}>
                <ShoppingBag className={styles.icon} size={24} />
                {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemCount}</span>
                )}
              </div>
            </Link>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              className={styles.loginBtn}
              onClick={handleLogout}
            >
              <User className={styles.icon} size={20} />
              <span>Log out</span>
            </button>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              <User className={styles.icon} size={20} />
              <span>Login / Sign up</span>
            </Link>
          )}
        </div>
      </div>
      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  )
}
