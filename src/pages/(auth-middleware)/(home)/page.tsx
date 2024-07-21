import { useGame } from '@/contexts/game.context.tsx'
import Game from './game'
import { Lobby } from './lobby/lobby'

export default function Home() {
  const { isActive } = useGame()

  return isActive ? <Game /> : <Lobby />
}
