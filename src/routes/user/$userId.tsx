import { ProfileTemplate } from '@/components/templates'
import { NestApi } from '@/services/nest-api'
import { Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$userId')({
  component: Page,
  shouldReload: false,
})

function Page() {
  const { userId } = Route.useParams()
  const userQuery = useQuery({
    queryKey: ['user', userId],
    staleTime: Number.POSITIVE_INFINITY,
    async queryFn() {
      return await NestApi.User.getById(userId)
    },
  })

  if (userQuery.isLoading || !userQuery.data) {
    return (
      <Center w="full" h="full">
        Loading...
      </Center>
    )
  }

  return <ProfileTemplate key={userId} user={userQuery.data} />
}
