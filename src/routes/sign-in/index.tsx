import { SignInTemplate } from '@/components/templates'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in/')({
  component: Page,
  validateSearch,
})

function validateSearch(search: Record<string, unknown>): {
  referrer?: string
} {
  return {
    referrer: search.referrer?.toString(),
  }
}

function Page() {
  const { referrer } = Route.useSearch()
  const navigate = useNavigate()
  navigate({
    to: '',
  })
  return <SignInTemplate referrer={referrer} />
}
