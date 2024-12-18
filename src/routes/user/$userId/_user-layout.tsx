import {
  matchesQueryOptions,
  rankingQueryOptions,
  userQueryOptions,
} from '@/utils/query-options'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$userId/_user-layout')({
  component: Layout,
})

function Layout() {
  const { userId } = Route.useParams()
  const userQuery = useQuery(userQueryOptions(userId))

  useQuery({
    ...matchesQueryOptions(userId),
    enabled: false,
  })
  useQuery({
    ...rankingQueryOptions(),
    enabled: false,
  })

  if (userQuery.isSuccess && !userQuery.data) return 'User not found'
  return <Outlet />
}
