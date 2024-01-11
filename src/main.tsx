import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './pages/layout'
import ProfilePage from './pages/profile/page'
import Home from './pages/(home)/page'
import NotFound from './pages/not-found'
import TutorialPage from './pages/tutorial/page'

console.clear()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        errorElement: <Layout />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/tutorial',
            element: <TutorialPage />,
          },
          {
            path: '/profile',
            children: [
              {
                path: '/profile',
                element: <ProfilePage index={0} />,
              },
              {
                path: '/profile/history',
                element: <ProfilePage index={1} />,
              },
              {
                path: '/profile/history/:matchId',
                element: <ProfilePage index={1} />,
              },
              {
                path: '/profile/standings',
                element: <ProfilePage index={2} />,
              },
            ],
          },
          {
            path: '/*',
            element: <NotFound />,
          },
        ],
      },
    ])}
  />,
)
