import { ProfileTemplate } from '@/components/templates'
import { useGuardedAuth } from '@/contexts/guarded-auth.context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/me/_me-layout/')({
  component: Page,
})

function Page() {
  const { user } = useGuardedAuth()

  return <ProfileTemplate baseUrl="/me" index="profile" user={user} />
}
