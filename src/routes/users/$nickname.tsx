import { NotFoundTemplate, ProfileTemplate } from '@/components/templates'
import { NestApi } from '@/services/nest-api'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$nickname')({
  component: RouteComponent,
})

function RouteComponent() {
  const { nickname } = Route.useParams()

  const uniqueId = nickname.toLowerCase().replaceAll(' ', '')

  console.log(nickname)

  const userQuery = useSuspenseQuery({
    queryKey: ['user-by-nickname', uniqueId],
    staleTime: Number.POSITIVE_INFINITY,
    async queryFn() {
      return await NestApi.User.getBySummonerName(nickname)
    },
  })

  const matchesQuery = useQuery({
    enabled: !!userQuery.data,
    queryKey: ['matches', userQuery.data?.id],
    staleTime: Number.POSITIVE_INFINITY,
    async queryFn() {
      return await NestApi.Match.getMatchesByUser(userQuery.data?.id || '', 20)
    },
  })

  if (!userQuery.data) {
    return <NotFoundTemplate />
  }

  return <ProfileTemplate matchesQuery={matchesQuery} user={userQuery.data} />
}
