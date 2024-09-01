import { ProfileTemplate } from '@/components/templates'
import { useGuardedAuth } from '@/contexts/guarded-auth.context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/me/_me-layout/$tab')({
  component: Page,
})

function Page() {
  const { tab } = Route.useParams()
  const { user } = useGuardedAuth()

  return <ProfileTemplate baseUrl="/me" index={tab} user={user} />
}
