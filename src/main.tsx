import { createRoot } from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './route-tree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

console.clear()
const root = document.getElementById('root')!
createRoot(root).render(
  <RouterProvider router={router} />
  // <RouterProvider
  //   router={createBrowserRouter([
  //     {
  //       path: '/',
  //       element: <Layout />,
  //       children: [
  //         {
  //           errorElement: <ErrorPage />,
  //           children: [
  //             {
  //               path: 'sign-in',
  //               element: <SignInPage />,
  //             },
  //             {
  //               path: 'register',
  //               element: <RegisterPage />,
  //             },
  //             {
  //               path: 'tutorial',
  //               element: <TutorialPage />,
  //             },
  //             {
  //               path: 'rating-system',
  //               element: <RatingSystemPage />,
  //             },
  //             {
  //               path: 'match/:matchId',
  //               element: <MatchPage />,
  //             },
  //             {
  //               path: 'user/:uid',
  //               element: <UserPageLayout />,
  //               children: [
  //                 {
  //                   path: '',
  //                   element: <UserPage index={0} />,
  //                 },
  //                 {
  //                   path: 'profile',
  //                   element: <UserPage index={0} />,
  //                 },
  //                 {
  //                   path: 'history',
  //                   element: <UserPage index={1} />,
  //                 },
  //                 {
  //                   path: 'history/:matchId',
  //                   element: <UserMatchPage />,
  //                 },
  //                 {
  //                   path: 'standings',
  //                   element: <UserPage index={2} />,
  //                 },
  //               ],
  //             },
  //             // Guarded routes
  //             {
  //               path: '',
  //               element: <AuthMiddleware />,
  //               children: [
  //                 {
  //                   path: '',
  //                   element: <Home />,
  //                 },
  //                 {
  //                   path: 'me',
  //                   element: <MeLayout />,
  //                   children: [
  //                     {
  //                       path: '',
  //                       element: <MePage index={0} />,
  //                     },
  //                     {
  //                       path: 'profile',
  //                       element: <MePage index={0} />,
  //                     },
  //                     {
  //                       path: 'history',
  //                       element: <MePage index={1} />,
  //                     },
  //                     {
  //                       path: 'history/:matchId',
  //                       element: <MeMatchPage />,
  //                     },
  //                     {
  //                       path: 'standings',
  //                       element: <MePage index={2} />,
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   path: '*',
  //                   element: <NotFound />,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ])}
  // />
)
