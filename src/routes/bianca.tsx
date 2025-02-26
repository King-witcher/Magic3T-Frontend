import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bianca')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Eu namoro uma cheirosa'
}
