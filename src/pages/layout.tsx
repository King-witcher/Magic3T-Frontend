import { Outlet } from 'react-router-dom'
import Providers from './providers'
import { RootLayout } from '@/components/root-layout/root-layout'

export default function Layout() {
  return (
    <Providers>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Providers>
  )
}
