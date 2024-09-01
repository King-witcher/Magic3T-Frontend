import { RegisterTemplate } from '@/components/templates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register/')({
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
  return <RegisterTemplate referrer={referrer} />
}
