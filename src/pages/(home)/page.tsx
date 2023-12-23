import { useGame } from '@/contexts/GameContext'
import Lobby from './Lobby'
import Game from './Game'

export default function Home() {
  const { gameState } = useGame()

  return gameState ? <Game /> : <Lobby />
}
