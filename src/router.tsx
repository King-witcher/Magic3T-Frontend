import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout'
import Index from '@/pages/index/page'

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
    ],
  },
])
