import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './pages/layout'
import NotFound from './pages/not-found'
import TutorialPage from './pages/tutorial/page'
import RatingSystemPage from './pages/rating-system/page'
import UserPageLayout from './pages/user/[uid]/layout'
import UserPage from './pages/user/[uid]/page'
import UserMatchPage from './pages/user/[uid]/history/[matchId]/page'
import MatchPage from './pages/match/[matchId]/page'
import AuthMiddleware from './pages/(auth-middleware)/layout'
import SignInPage from './pages/sign-in/page'
import RegisterPage from './pages/register/page'
import Home from './pages/(auth-middleware)/(home)/page'
import MeLayout from '@/pages/(auth-middleware)/me/layout.tsx'
import MePage from '@/pages/(auth-middleware)/me/page.tsx'
import MeMatchPage from '@/pages/(auth-middleware)/me/history/[matchId]/page.tsx'
import Error from './pages/error'

console.clear()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            errorElement: <Error />,
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
  />,
)
