import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Loader } from './components/Loader/Loader'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'

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
  return <RouterProvider router={router} />
}

export default App
