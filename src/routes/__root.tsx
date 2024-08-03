import { RootLayout } from '@/components'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Providers } from './-providers'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorTemplate } from '@/components/templates'

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
