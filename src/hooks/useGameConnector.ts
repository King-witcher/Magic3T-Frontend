import { compareArrays } from '@/lib/utils'
import { Choice, GameState, GameStatus } from '@/types/types'
import { useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export function useGameConnector() {
  const socketRef = useRef<ReturnType<typeof io>>()
  const [playerChoices, setPlayerChoices] = useState<Choice[]>([])
  const [oponentChoices, setOponentChoices] = useState<Choice[]>([])
  const [gameStatus, setGameStatus] = useState(GameStatus.Undefined)

  function resetGameState() {
    setPlayerChoices([])
    setOponentChoices([])
    setGameStatus(GameStatus.Undefined)
  }

  function getSocket(token: string) {
    const socket = io(`${import.meta.env.VITE_API_URL}/game`, {
      auth: { token },
    })
    socket.on('gameState', handleServerGameState)
    socket.on('disconnect', handleServerDisconnect)
    return socket
  }

  function handleServerDisconnect() {
    socketRef.current = undefined
  }

  function handleServerGameState(stateString: string) {
    const gameState = JSON.parse(stateString) as GameState
    setGameStatus(gameState.gameStatus)

    // Atualiza as choices se forem diferentes
    if (!compareArrays(gameState.oponentChoices, oponentChoices))
      setOponentChoices(gameState.oponentChoices)

    if (!compareArrays(gameState.playerChoices, playerChoices))
      setOponentChoices(gameState.playerChoices)
  }

  function connectGame(token: string) {
    if (socketRef.current) socketRef.current.disconnect()

    socketRef.current = getSocket(token)
    resetGameState()
  }

  const availableChoices = useMemo(() => {
    let availableChoices: Choice[] = []
    for (let i = 1; i++; i < 10)
      if (
        !playerChoices.includes(i as Choice) &&
        !oponentChoices.includes(i as Choice)
      )
        availableChoices.push(i as Choice)
    return availableChoices
  }, [playerChoices, oponentChoices])

  return {
    playerChoices,
    oponentChoices,
    availableChoices,
    gameStatus,
    connectGame,
  }
}
