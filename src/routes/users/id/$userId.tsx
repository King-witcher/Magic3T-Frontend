import {
  Loading,
  NotFoundTemplate,
  ProfileTemplate,
} from '@/components/templates'
import { NestApi } from '@/services/nest-api'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/id/$userId')({
  component: Page,
  pendingComponent: () => <Loading />,
  notFoundComponent: () => <NotFoundTemplate />,
  shouldReload: false,
})

function Page() {
  const { userId } = Route.useParams()

  const matchesQuery = useQuery({
    queryKey: ['matches', userId],
    async queryFn() {
      return await NestApi.Match.getMatchesByUser(userId, 20)
    },
  })

  const userQuery = useSuspenseQuery({
    queryKey: ['user', userId],
    staleTime: Number.POSITIVE_INFINITY,
    async queryFn() {
      return await NestApi.User.getById(userId)
    },
  })

  if (!userQuery.data) {
    return <NotFoundTemplate />
  }

  return (
    <ProfileTemplate
      key={userId}
      user={userQuery.data}
      matchesQuery={matchesQuery}
    />
  )
}
