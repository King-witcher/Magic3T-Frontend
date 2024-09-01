import { RatingSystemTemplate } from '@/components/templates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rating-system')({
  component: RatingSystemTemplate,
})
