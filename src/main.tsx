import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './pages/layout'
import Home from './pages/(home)/page'
import NotFound from './pages/not-found'
import TutorialPage from './pages/tutorial/page'
import RatingSystemPage from './pages/rating-system/page'
import MePage from './pages/me/page'
import MeMatchPage from './pages/me/history/[matchId]/page'
import MeLayout from './pages/me/layout'
import UserPageLayout from './pages/user/[uid]/layout'
import UserPage from './pages/user/[uid]/page'
import UserMatchPage from './pages/user/[uid]/history/[matchId]/page'

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
            path: '',
            element: <Home />,
          },
          {
            path: 'tutorial',
            element: <TutorialPage />,
          },
          {
            path: 'rating-system',
            element: <RatingSystemPage />,
          },
          {
            path: 'me',
            element: <MeLayout />,
            children: [
              {
                path: '',
                element: <MePage index={0} />,
              },
              {
                path: 'profile',
                element: <MePage index={0} />,
              },
              {
                path: 'history',
                element: <MePage index={1} />,
              },
              {
                path: 'history/:matchId',
                element: <MeMatchPage />,
              },
              {
                path: 'standings',
                element: <MePage index={2} />,
              },
            ],
          },
          {
            path: 'user/:uid',
            element: <UserPageLayout />,
            children: [
              {
                path: '',
                element: <UserPage index={0} />,
              },
              {
                path: 'profile',
                element: <UserPage index={0} />,
              },
              {
                path: 'history',
                element: <UserPage index={1} />,
              },
              {
                path: 'history/:matchId',
                element: <UserMatchPage />,
              },
              {
                path: 'standings',
                element: <UserPage index={2} />,
              },
            ],
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ])}
  />,
)
