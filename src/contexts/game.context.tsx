import { Timer } from '@/lib/Timer'
import { models } from '@/models'
import type { UserData } from '@/models/users/User'
import { Api } from '@/services/api'
import {
  GameEmittedEvents,
  GameListenedEvent,
  type GameSocket,
} from '@/types/GameSocket.ts'
import { type Choice, type GameStateReport, GameStatus } from '@/types/game.ts'
import { getTriple } from '@/utils/getTriple'
import { useBreakpoint } from '@chakra-ui/react'
import type { Unsubscribe } from 'firebase/auth'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { IoChatbox, IoGameController } from 'react-icons/io5'
import { type Socket, io } from 'socket.io-client'
import { AuthState } from './auth.context.tsx'
import { useGuardedAuth } from './guarded-auth.context.tsx'
import { useLiveActivity } from './live-activity.context.tsx'

type Message = { sender: 'you' | 'him'; content: string; timestamp: number }

type GameData =
  | {
      matchId: null
      isActive: false
      turn: null
      gameStatus: GameStatus.Waiting
      messages: Message[]
      playerChoices: Choice[]
      oponentChoices: Choice[]
      playerTimer: Timer
      oponentTimer: Timer
      availableChoices: Choice[]
      winningTriple: null
      oponentProfile: null
      ratingsVariation: null

      connectGame(matchId: string): Promise<void>
      makeChoice(choice: Choice): void
      sendMessage(message: string): void
      forfeit(): Promise<void>
      disconnect(): void
    }
  | {
      matchId: string
      isActive: true
      turn: 'player' | 'oponent' | null
      gameStatus: GameStatus
      messages: Message[]
      playerChoices: Choice[]
      oponentChoices: Choice[]
      playerTimer: Timer
      oponentTimer: Timer
      availableChoices: Choice[]
      winningTriple: [Choice, Choice, Choice] | null
      oponentProfile: UserData | null
      ratingsVariation: { player: number; oponent: number } | null

      connectGame(matchId: string): Promise<void>
      makeChoice(choice: Choice): void
      sendMessage(message: string): void
      forfeit(): Promise<void>
      disconnect(): void
    }

interface Props {
  children?: ReactNode
}

const GameContext = createContext<GameData>({} as GameData)

export function GameProvider({ children }: Props) {
  const [matchId, setMatchId] = useState<string | null>(null)
  const isActive = !!matchId
  const [turn, setTurn] = useState<'player' | 'oponent' | null>(null)
  const [gameStatus, setGameStatus] = useState(GameStatus.Waiting)
  const [playerChoices, setPlayerChoices] = useState<Choice[]>([])
  const [opponentChoices, setOpponentChoices] = useState<Choice[]>([])
  const [triple, setTriple] = useState<[Choice, Choice, Choice] | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [opponentProfile, setOpponentProfile] = useState<UserData | null>(null)
  const [ratingsVariation, setRatingsVariation] = useState<{
    player: number
    opponent: number
  } | null>(null)

  const playerTimer = useRef(new Timer(0))
  const opponentTimer = useRef(new Timer(0))
  const socketRef = useRef<GameSocket | null>(null)

  const { getToken, authState } = useGuardedAuth()
  const { push } = useLiveActivity()
  const breakpoint = useBreakpoint()

  /** Limpa o estado do jogo, colocando os timers em 0. */
  const resetStates = useCallback(() => {
    setMatchId(null)
    setTurn(null)
    setGameStatus(GameStatus.Waiting)
    setPlayerChoices([])
    setOpponentChoices([])
    setMessages([])
    setTriple(null)
    setRatingsVariation(null)
    playerTimer.current.pause()
    opponentTimer.current.pause()
    playerTimer.current.setRemaining(0)
    opponentTimer.current.setRemaining(0)
    setOpponentProfile(null)
  }, [])

  useEffect(() => {
    if (
      breakpoint === 'base' &&
      messages.length &&
      messages[messages.length - 1].sender !== 'you'
    ) {
      const remove = push({
        content: <IoChatbox size="16px" />,
        tooltip: 'Você tem uma nova mensagem',
      })
      setTimeout(remove, 3000)
      return remove
    }
  }, [messages.length, breakpoint])

  const handleReceiveOpponentUid = useCallback(async (uid: string) => {
    const opponentProfile = await models.users.getById(uid)
    setOpponentProfile(opponentProfile)
  }, [])

  const handleReceiveRatingsVariation = useCallback(
    (data: { player: number; opponent: number }) => {
      setRatingsVariation(data)
    },
    [setRatingsVariation]
  )

  const handleReceiveMessage = useCallback((message: string) => {
    setMessages((current) => [
      ...current,
      {
        timestamp: Date.now(),
        content: message,
        sender: 'him',
      },
    ])
  }, [])

  const makeChoice = useCallback((choice: Choice) => {
    socketRef.current?.emit(GameEmittedEvents.Choice, choice)

    setTurn('oponent')
    setPlayerChoices((current) => [...current, choice])

    playerTimer.current.pause()
    opponentTimer.current.start()
  }, [])

  function handleServerDisconnect(reason: Socket.DisconnectReason) {
    console.warn('Socket disconnected because of', `${reason}.`)
    if (reason === 'transport error' && matchId) {
      connectGame(matchId)
      console.log('Attempting to reconnect')
    }
    socketRef.current?.connect()
  }

  function handleServerGameState(incomingGameState: GameStateReport) {
    setTurn(incomingGameState.turn)
    setGameStatus(incomingGameState.status)
    setPlayerChoices(incomingGameState.playerChoices)
    setOpponentChoices(incomingGameState.oponentChoices)

    // Muda qual timer está contando
    if (incomingGameState.turn) {
      playerTimer.current.start()
      opponentTimer.current.pause()
    } else if (incomingGameState.status === GameStatus.Playing) {
      playerTimer.current.pause()
      opponentTimer.current.start()
    } else {
      playerTimer.current.pause()
      opponentTimer.current.pause()
    }

    // Sincroniza os timers com os dados recebidos do servidor
    playerTimer.current.setRemaining(incomingGameState.playerTimeLeft)
    opponentTimer.current.setRemaining(incomingGameState.oponentTimeLeft)

    if (incomingGameState.status === GameStatus.Victory)
      setTriple(getTriple(incomingGameState.playerChoices))
    else if (incomingGameState.status === GameStatus.Defeat)
      setTriple(getTriple(incomingGameState.oponentChoices))
  }

  const getGameSocket = useCallback(
    async (matchId: string): Promise<GameSocket> => {
      const token = await getToken()
      if (!token) throw new Error('No Id Token')

      const socket: GameSocket = io(`${import.meta.env.VITE_API_URL}/match`, {
        auth: { matchId, token },
      })

      return socket
        .on(GameListenedEvent.GameState, handleServerGameState)
        .on('disconnect', handleServerDisconnect)
        .on(GameListenedEvent.Message, handleReceiveMessage)
        .on(GameListenedEvent.OpponentUid, handleReceiveOpponentUid)
        .on(GameListenedEvent.RatingsVariation, handleReceiveRatingsVariation)
        .on('connect', () => {
          socket.emit(GameEmittedEvents.GetOpponent)
          socket.emit(GameEmittedEvents.GetState)
        })
    },
    [getToken]
  )

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current) {
      setMessages((current) => [
        ...current,
        {
          content: message,
          sender: 'you',
          timestamp: Date.now(),
        },
      ])

      socketRef.current?.emit(GameEmittedEvents.Message, message)
    }
  }, [])

  const forfeit = useCallback(async () => {
    await socketRef.current?.emitWithAck(GameEmittedEvents.Forfeit)
  }, [])

  const connectGame = useCallback(
    async (matchId: string) => {
      socketRef.current?.disconnect()

      resetStates()

      const newSocket = await getGameSocket(matchId)
      socketRef.current = newSocket
      setMatchId(matchId)
      setTurn(null)
      setGameStatus(GameStatus.Waiting)
      setOpponentChoices([])
      setPlayerChoices([])
    },
    [getGameSocket, resetStates]
  )

  function disconnect() {
    socketRef.current?.disconnect()
    socketRef.current = null
    resetStates()
  }

  const availableChoices = useMemo(() => {
    if (!matchId) {
      return []
    }

    const availableChoices: Choice[] = []

    for (let i = 1; i < 10; i++) {
      if (
        !playerChoices.includes(i as Choice) &&
        !opponentChoices.includes(i as Choice)
      )
        availableChoices.push(i as Choice)
    }

    return availableChoices
  }, [playerChoices])

  // Auto connects the user to the current game that is being played.
  useEffect(() => {
    async function checkStatus() {
      try {
        if (authState !== AuthState.SignedIn) return
        const token = await getToken()
        if (!token) return
        const response = await Api.get('/matchId', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 200) {
          await connectGame(response.data.id)
        }
      } catch (e) {
        console.error(e)
      }
    }

    checkStatus()
  }, [getToken, authState])

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    if (opponentProfile)
      unsubscribe = models.users.subscribe(opponentProfile?._id, (data) => {
        setOpponentProfile(data)
      })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [opponentProfile?._id])

  useEffect(() => {
    if (matchId) {
      return push({
        content: <IoGameController size="16px" />,
        tooltip: 'Em jogo',
        url: '/',
      })
    }
  }, [isActive])

  return (
    <GameContext.Provider
      value={
        {
          matchId,
          isActive,
          turn,
          gameStatus,
          messages,
          playerChoices,
          oponentChoices: opponentChoices,
          playerTimer: playerTimer.current,
          oponentTimer: opponentTimer.current,
          availableChoices,
          winningTriple: triple,
          oponentProfile: opponentProfile,
          ratingsVariation,

          /** Se conecta a um jogo a partir de um token. */
          connectGame,
          makeChoice,
          disconnect,
          sendMessage,
          forfeit,
        } as GameData
      }
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
