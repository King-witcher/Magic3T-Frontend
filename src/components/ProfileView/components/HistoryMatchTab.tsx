import MatchViewer from '@/components/MatchViewer'

interface Props {
  matchId: string
}

export default function HistoryMatchTab({ matchId }: Props) {
  return <MatchViewer matchId={matchId} />
}
