import { TutorialTemplate } from '@/components/templates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tutorial')({
  component: TutorialTemplate,
})
