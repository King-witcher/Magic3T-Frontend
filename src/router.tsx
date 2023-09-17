import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout'
import Index from '@/pages/index/page'
import GamePage from './pages/game/[gameId]/page'

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
        path: '/game/:gameId',
        element: <GamePage />,
      },
    ],
  },
])
