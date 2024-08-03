import { ProfileTemplate } from '@/components/templates'
import { userOptions } from '@/utils/query-options'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$userId/_user-layout/$tab/')({
  component: Page,
})

function Page() {
  const { userId, tab } = Route.useParams()
  const userQuery = useQuery(userOptions(userId))
  if (userQuery.isLoading || !userQuery.data) {
    return <>loading</>
  }
  return (
    <>
      <ProfileTemplate
        baseUrl={`/user/${userId}`}
        index={tab}
        user={userQuery.data}
      />
    </>
  )
}
