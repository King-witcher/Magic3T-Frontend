import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/me/_user-layout')({
  component: () => <div>Hello /_auth-guarded/me/_user-layout!</div>,
})
