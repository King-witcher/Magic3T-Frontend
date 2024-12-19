import { RankingTemplate } from '@/components/templates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranking')({
  component: () => <RankingTemplate />,
})
