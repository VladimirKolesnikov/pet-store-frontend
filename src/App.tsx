import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { ErrorPage } from './pages/Error/Error'
import { Login } from './pages/Login/Login'

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
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
