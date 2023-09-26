import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout'
import Index from '@/pages/index/page'
import GamePage from './pages/game/[gameId]/page'
import { Login } from './pages/login/page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Layout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/game/:gameId',
        element: <GamePage />,
      },
    ],
  },
])
