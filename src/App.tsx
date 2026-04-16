import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Loader } from './components/Loader/Loader'
import { AuthProvider } from './context/AuthContext'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'

const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail'))
const CategoryProducts = lazy(() =>
  import('./pages/CategoryProducts/CategoryProducts').then((module) => ({
    default: module.CategoryProducts,
  }))
)
const Cart = lazy(() => import('./pages/Cart/Cart'))
const ErrorPage = lazy(() => import('./pages/Error/Error'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Login />,
      },
      {
        path: '/product/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: '/categories/:slug',
        element: (
          <Suspense fallback={<Loader />}>
            <CategoryProducts />
          </Suspense>
        ),
      },
      {
        path: '/cart',
        element: (
          <Suspense fallback={<Loader />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loader />}>
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
