import { ErrorTemplate, RootLayout } from '@/components/templates'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import React from 'react'
import { Providers } from './-providers'

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      )

export const Route = createRootRoute({
  component: () => (
    <Providers>
      <RootLayout>
        <Outlet />
      </RootLayout>
      <ReactQueryDevtools />
      <TanStackRouterDevtools position="bottom-left" />
    </Providers>
  ),
  notFoundComponent: () => <>Not found</>,
  errorComponent: () => <ErrorTemplate />,
})
