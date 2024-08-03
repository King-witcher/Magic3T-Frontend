import { RootLayout } from '@/components/templates/root-layout/root-layout'
import { Providers } from '@/routes/-providers'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <Providers>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Providers>
  )
}
