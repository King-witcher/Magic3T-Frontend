import { ProfileTemplate } from '@/components/templates'
import { useGuardedAuth } from '@/contexts/guarded-auth.context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/me')({
  component: () => {
    const { user } = useGuardedAuth()

    return <ProfileTemplate user={user} />
  },
})
