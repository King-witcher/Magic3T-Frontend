import { RootLayout } from '@/components/root-layout/root-layout'
import { Outlet } from 'react-router-dom'
import Providers from './providers'

export default function Layout() {
  return (
    <Providers>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Providers>
  )
}
