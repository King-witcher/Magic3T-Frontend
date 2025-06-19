import { ProfileTemplate } from '@/components/templates'
import { useGuardedAuth } from '@/contexts/guarded-auth.context'
import { NestApi } from '@/services/nest-api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/me')({
  component: () => {
    const { user } = useGuardedAuth()

    const matchesQuery = useQuery({
      queryKey: ['matches', user.id],
      async queryFn() {
        return await NestApi.Match.getMatchesByUser(user.id, 20)
      },
    })

    return <ProfileTemplate user={user} matchesQuery={matchesQuery} editable />
  },
})
