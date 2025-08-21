import { ProfileTemplate } from '@/components/templates'
import { useUser } from '@/contexts/auth.context'
import { NestApi } from '@/services/nest-api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/me')({
  component: () => {
    const user = useUser()

    const matchesQuery = useQuery({
      queryKey: ['matches', user.id],
      async queryFn() {
        return await NestApi.Match.getMatchesByUser(user.id, 20)
      },
    })

    return <ProfileTemplate user={user} matchesQuery={matchesQuery} editable />
  },
})
