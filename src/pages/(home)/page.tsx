import { useGame } from '@/contexts/GameContext'
import Lobby from './Lobby'
import Game from './Game'

export default function Home() {
  const { isActive } = useGame()

  return isActive ? <Game /> : <Lobby />
}
