import { Timer } from '@/lib/Timer'
import { compareArrays } from '@/lib/utils'
import { Choice, GameState, GameStatus } from '@/types/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
export function useGameConnector() {
  const playerTimer = useMemo(() => new Timer(0), [])
  const oponentTimer = useMemo(() => new Timer(0), [])
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
  const [playerChoices, setPlayerChoices] = useState<Choice[]>([])
  const [oponentChoices, setOponentChoices] = useState<Choice[]>([])
  const [gameStatus, setGameStatus] = useState(GameStatus.Undefined)
  const [turn, setTurn] = useState<'player' | 'oponent' | null>(null)

  /**Limpa o estado do jogo, colocando os timers em 0. */
  function resetGameState() {
    setPlayerChoices([])
    setOponentChoices([])
    setGameStatus(GameStatus.Undefined)
    playerTimer.reset(0)
    oponentTimer.reset(0)
    setTurn(null)
  }

  function getEventfulSocket(token: string) {
    const socket = io(`${import.meta.env.VITE_API_URL}/game`, {
      auth: { token },
    })

    return socket
      .on('gameState', handleServerGameState)
      .on('disconnect', handleServerDisconnect)
  }

  function makeChoice(choice: Choice) {
    socket?.emit('choice', choice)
  }

  function handleServerDisconnect() {
    setSocket(null)
  }

  function handleServerGameState(stateString: string) {
    const gameState = JSON.parse(stateString) as GameState
    setGameStatus(gameState.gameStatus)

    // Atualiza as choices se forem diferentes
    if (!compareArrays(gameState.oponentChoices, oponentChoices))
      setOponentChoices(gameState.oponentChoices)

    if (!compareArrays(gameState.playerChoices, playerChoices))
      setPlayerChoices(gameState.playerChoices)

    // Atualiza a informação sobre turno
    if (gameState.turn) {
      setTurn('player')
      playerTimer.start()
      oponentTimer.pause()
    } else if (gameState.gameStatus === GameStatus.Ongoing) {
      setTurn('oponent')
      playerTimer.pause()
      oponentTimer.start()
    } else {
      setTurn(null)
      playerTimer.pause()
      oponentTimer.pause()
    }

    // Sincroniza os timers
    playerTimer.setRemaining(gameState.playerTimeLeft)
    oponentTimer.setRemaining(gameState.oponentTimeLeft)
  }

  function connectGame(token: string) {
    if (socket) socket.disconnect()

    resetGameState()
    const newSocket = getEventfulSocket(token)
    setSocket(newSocket)
    newSocket.emit('ready', {})
  }

  const availableChoices = useMemo(() => {
    let availableChoices: Choice[] = []

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
      socket?.disconnect()
    }
  }, [])

  return {
    playerChoices,
    playerTimer,
    oponentChoices,
    oponentTimer,
    availableChoices,
    gameStatus,
    turn,

    /** Se conecta a um jogo a partir de um token. */
    connectGame,
    makeChoice,
  }
}
