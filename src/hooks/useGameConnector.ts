import { Timer } from '@/lib/Timer'
import { compareArrays } from '@/lib/utils'
import { Choice, GameState, GameStatus } from '@/types/types'
import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

export function useGameConnector() {
  const playerTimer = useMemo(() => new Timer(0), [])
  const oponentTimer = useMemo(() => new Timer(0), [])
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
  const [playerChoices, setPlayerChoices] = useState<Choice[]>([])
  const [oponentChoices, setOponentChoices] = useState<Choice[]>([])
  const [gameStatus, setGameStatus] = useState(GameStatus.Undefined)
  const [turn, setTurn] = useState<'player' | 'oponent' | null>(null)
  const [triple, setTriple] = useState<[Choice | 0, Choice | 0, Choice | 0]>([
    0, 0, 0,
  ])

  /**Limpa o estado do jogo, colocando os timers em 0. */
  function resetGameState() {
    setPlayerChoices([])
    setOponentChoices([])
    setGameStatus(GameStatus.Undefined)
    playerTimer.reset(0)
    oponentTimer.reset(0)
    setTurn(null)
  }

  function getEventfulSocket(matchId: string, playerKey: string) {
    const socket = io(`${import.meta.env.VITE_API_URL}/match`, {
      auth: { playerKey },
      query: { matchId },
    })

    console.log('matchId', matchId)

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
    const incomingGameState = JSON.parse(stateString) as GameState
    setGameStatus(incomingGameState.gameStatus)

    // Atualiza as choices se forem diferentes
    if (!compareArrays(incomingGameState.oponentChoices, oponentChoices))
      setOponentChoices(incomingGameState.oponentChoices)

    if (!compareArrays(incomingGameState.playerChoices, playerChoices))
      setPlayerChoices(incomingGameState.playerChoices)

    // Atualiza a informação sobre turno
    if (incomingGameState.turn) {
      setTurn('player')
      playerTimer.start()
      oponentTimer.pause()
    } else if (incomingGameState.gameStatus === GameStatus.Ongoing) {
      setTurn('oponent')
      playerTimer.pause()
      oponentTimer.start()
    } else {
      setTurn(null)
      playerTimer.pause()
      oponentTimer.pause()
    }

    // Define o terno de números vencedor.
    function getTriple(
      numbers: Choice[]
    ): [Choice | 0, Choice | 0, Choice | 0] {
      for (let i = 0; i < numbers.length - 2; i++)
        for (let j = 1; j < numbers.length - 1; j++)
          for (let k = 2; k < numbers.length; k++)
            if (numbers[i] + numbers[j] + numbers[k] === 15)
              return [numbers[i], numbers[j], numbers[k]]
      return [0, 0, 0]
    }
    if (incomingGameState.gameStatus === GameStatus.Victory)
      setTriple(getTriple(incomingGameState.playerChoices))
    else if (incomingGameState.gameStatus === GameStatus.Defeat)
      setTriple(getTriple(incomingGameState.oponentChoices))

    // Sincroniza os timers
    playerTimer.setRemaining(incomingGameState.playerTimeLeft)
    oponentTimer.setRemaining(incomingGameState.oponentTimeLeft)
  }

  function connectGame(matchId: string, playerKey: string) {
    if (socket) socket.disconnect()

    resetGameState()
    const newSocket = getEventfulSocket(matchId, playerKey)
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
    triple,

    /** Se conecta a um jogo a partir de um token. */
    connectGame,
    makeChoice,
  }
}
