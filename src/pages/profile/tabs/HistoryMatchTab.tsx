import MatchViewer from '@/components/MatchViewer'
import { Match } from '@/models/matches/Match'
import { WithId } from '@/types/WithId'

interface Props {
  matchId: string
}

export default function HistoryMatchTab({ matchId }: Props) {
  return <MatchViewer match={matchId} />
}
