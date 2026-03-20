import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

export function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isLogin = location.pathname !== '/signup'

  const toggleMode = () => {
    if (isLogin) {
      navigate('/signup')
    } else {
      navigate('/login')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(isLogin ? 'Logging in...' : 'Signing up...')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className={styles.subtitle}>
          {isLogin
            ? 'Enter your credentials to access your account.'
            : 'Fill in the details below to get started.'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={toggleMode}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

        <Link to="/" className={styles.backLink}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
