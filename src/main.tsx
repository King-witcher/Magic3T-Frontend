import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import './prelude'
import { routeTree } from './route-tree.gen'
import './main.css'
import '@/styles/fonts.sass'
import '@/styles/base.sass'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

console.clear()

const root = document.getElementById('root')!
createRoot(root).render(<RouterProvider router={router} />)
