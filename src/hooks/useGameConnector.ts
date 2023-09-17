import { Timer } from '@/lib/Timer'
import { compareArrays } from '@/lib/utils'
import { Choice, GameState, GameStatus } from '@/types/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export function useGameConnector() {
  const socketRef = useRef<ReturnType<typeof io>>()

  const timerRef = useRef<Timer>(new Timer(0))
  const [playerChoices, setPlayerChoices] = useState<Choice[]>([])
  const [oponentChoices, setOponentChoices] = useState<Choice[]>([])
  const [gameStatus, setGameStatus] = useState(GameStatus.Undefined)

  /**Limpa o estado do jogo, colocando os timers em 0. */
  function clearGameState() {
    setPlayerChoices([])
    setOponentChoices([])
    setGameStatus(GameStatus.Undefined)
    timerRef.current.reset(0)
  }

  function getEventfulSocket(token: string) {
    const socket = io(`${import.meta.env.VITE_API_URL}/game`, {
      auth: { token },
    })
    socket.on('gameState', handleServerGameState)
    socket.on('disconnect', handleServerDisconnect)
    return socket
  }

  function makeChoice(choice: Choice) {
    if (!socketRef.current) return

    socketRef.current.emit('choice', choice)
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
      setPlayerChoices(gameState.playerChoices)
  }

  function connectGame(token: string) {
    if (socketRef.current) socketRef.current.disconnect()

    socketRef.current = getEventfulSocket(token)
    clearGameState()
  }

  const availableChoices = useMemo(() => {
    let availableChoices: Choice[] = []
    console.log(playerChoices, oponentChoices)

    for (let i = 1; i < 10; i++) {
      if (
        !playerChoices.includes(i as Choice) &&
        !oponentChoices.includes(i as Choice)
      )
        availableChoices.push(i as Choice)
    }

    return availableChoices
  }, [playerChoices, oponentChoices])

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  return {
    playerChoices,
    oponentChoices,
    availableChoices,
    gameStatus,

    /** Se conecta a um jogo a partir de um token. */
    connectGame,
    makeChoice,
  }
}
