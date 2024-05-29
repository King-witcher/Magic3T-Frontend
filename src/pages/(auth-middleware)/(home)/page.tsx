import { useGame } from '@/contexts/game.context.tsx'
import Lobby from './Lobby'
import Game from './Game'

export default function Home() {
  const { isActive } = useGame()

  return isActive ? <Game /> : <Lobby />
}
