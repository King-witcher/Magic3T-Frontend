import { StoreTemplate } from '@/components/templates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/store')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StoreTemplate />
}
