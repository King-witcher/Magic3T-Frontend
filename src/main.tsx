import MeMatchPage from '@/pages/(auth-middleware)/me/history/[matchId]/page.tsx'
import MeLayout from '@/pages/(auth-middleware)/me/layout.tsx'
import MePage from '@/pages/(auth-middleware)/me/page.tsx'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/(auth-middleware)/(home)/page'
import AuthMiddleware from './pages/(auth-middleware)/layout'
import { ErrorPage } from './pages/error'
import Layout from './pages/layout'
import MatchPage from './pages/match/[matchId]/page'
import NotFound from './pages/not-found'
import RatingSystemPage from './pages/rating-system/page'
import RegisterPage from './pages/register/page'
import SignInPage from './pages/sign-in/page'
import TutorialPage from './pages/tutorial/page'
import UserMatchPage from './pages/user/[uid]/history/[matchId]/page'
import UserPageLayout from './pages/user/[uid]/layout'
import UserPage from './pages/user/[uid]/page'

console.clear()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            errorElement: <ErrorPage />,
            children: [
              {
                path: 'sign-in',
                element: <SignInPage />,
              },
              {
                path: 'register',
                element: <RegisterPage />,
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
                path: 'match/:matchId',
                element: <MatchPage />,
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
              // Guarded routes
              {
                path: '',
                element: <AuthMiddleware />,
                children: [
                  {
                    path: '',
                    element: <Home />,
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
                    path: '*',
                    element: <NotFound />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ])}
  />
)
