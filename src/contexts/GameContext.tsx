import { Timer } from '@/lib/Timer'
import { Choice, GameStateReport, GameStatus } from '@/types/types'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Socket, io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { UserData } from '@/models/users/User'
import { models } from '@/models'
import { Unsubscribe } from 'firebase/auth'
import { Api } from '@/services/api'

type Message = { sender: 'you' | 'him'; content: string; timestamp: number }

interface GameState {
  player: {
    choices: Choice[]
  }
  oponent: {
    choices: Choice[]
  }
  gameStatus: GameStatus
  turn: 'player' | 'oponent' | null
  matchId: string | null
  messages: Message[]
}

interface GameData {
  gameState: GameState | null
  playerTimer: Timer
  oponentTimer: Timer
  availableChoices: Choice[]
  winningTriple: [Choice, Choice, Choice] | null
  oponentProfile: UserData | null

  connectGame(matchId: string): Promise<void>
  makeChoice(choice: Choice): void
  sendMessage(message: string): void
  forfeit(): Promise<void>
  disconnect(): void
}

interface Profile {
  name: string
  uid: string
  rating: number
  photoUrl: string
}

interface Props {
  children?: ReactNode
}

const GameContext = createContext<GameData>({} as GameData)

export function GameProvider({ children }: Props) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [triple, setTriple] = useState<[Choice, Choice, Choice] | null>(null)
  const playerTimer = useRef(new Timer(0))
  const oponentTimer = useRef(new Timer(0))
  const socketRef = useRef<Socket | null>(null)
  const { getToken, logged } = useAuth()

  const [oponentProfile, setOponentProfile] = useState<UserData | null>(null)

  /**Limpa o estado do jogo, colocando os timers em 0. */
  const resetGameState = useCallback(() => {
    setGameState(null)
    setTriple(null)
    playerTimer.current.pause()
    oponentTimer.current.pause()
    playerTimer.current.setRemaining(0)
    oponentTimer.current.setRemaining(0)
    setOponentProfile(null)
  }, [])

  const getEventfulSocket = useCallback(
    async (matchId: string) => {
      const token = await getToken()
      if (!token) throw new Error('No Id Token')

      const socket = io(`${import.meta.env.VITE_API_URL}/match`, {
        auth: { matchId, token },
      })

      return (
        socket
          .on('gameState', handleServerGameState)
          .on('disconnect', handleServerDisconnect)
          .on('message', handleReceiveMessage)
          // .on('oponentProfile', (profile) => {
          //   setGameState(
          //     (current) =>
          //       current && {
          //         ...current,
          //         oponent: {
          //           ...current.oponent,
          //           profile,
          //         },
          //       },
          //   )
          // })
          .on('oponentUid', handleReceiveOponentUid)
          .on('connect', () => {
            socket.emit('getOponentProfile')
          })
      )
    },
    [getToken],
  )

  const handleReceiveOponentUid = useCallback(async (uid: string) => {
    const oponentProfile = await models.users.getById(uid)
    setOponentProfile(oponentProfile)
  }, [])

  const handleReceiveMessage = useCallback((message: string) => {
    setGameState(
      (current) =>
        current && {
          ...current,
          messages: [
            ...current.messages,
            {
              timestamp: Date.now(),
              content: message,
              sender: 'him',
            },
          ],
        },
    )
  }, [])

  const makeChoice = useCallback(
    (choice: Choice) => {
      socketRef.current?.emit('choice', choice)

      setGameState(
        (current) =>
          current && {
            ...current,
            player: {
              ...current.player,
              choices: [...current.player.choices, choice],
            },
            turn: 'oponent',
          },
      )

      playerTimer.current.pause()
      oponentTimer.current.start()
    },
    [setGameState],
  )

  function handleServerDisconnect(reason: Socket.DisconnectReason) {
    console.log('Socket disconnected because of', reason + '.')
    socketRef.current?.connect()
  }

  function handleServerGameState(stateString: string) {
    const incomingGameState = JSON.parse(stateString) as GameStateReport
    setGameState(
      (current) =>
        current && {
          ...current,
          gameStatus: incomingGameState.status,
          player: {
            ...current.player,
            choices: incomingGameState.playerChoices,
          },
          oponent: {
            ...current.oponent,
            choices: incomingGameState.oponentChoices,
          },
          turn: incomingGameState.turn
            ? 'player'
            : incomingGameState.status === GameStatus.Playing
            ? 'oponent'
            : null,
        },
    )

    // Muda qual timer está contando
    if (incomingGameState.turn) {
      playerTimer.current.start()
      oponentTimer.current.pause()
    } else if (incomingGameState.status === GameStatus.Playing) {
      playerTimer.current.pause()
      oponentTimer.current.start()
    } else {
      playerTimer.current.pause()
      oponentTimer.current.pause()
    }

    // Sincroniza os timers com os dados recebidos do servidor
    playerTimer.current.setRemaining(incomingGameState.playerTimeLeft)
    oponentTimer.current.setRemaining(incomingGameState.oponentTimeLeft)

    // Define o terno de números vencedor.
    function getTriple(numbers: Choice[]): [Choice, Choice, Choice] | null {
      for (let i = 0; i < numbers.length - 2; i++)
        for (let j = i + 1; j < numbers.length - 1; j++)
          for (let k = j + 1; k < numbers.length; k++)
            if (numbers[i] + numbers[j] + numbers[k] === 15)
              return [numbers[i], numbers[j], numbers[k]]
      return null
    }

    if (incomingGameState.status === GameStatus.Victory)
      setTriple(getTriple(incomingGameState.playerChoices))
    else if (incomingGameState.status === GameStatus.Defeat)
      setTriple(getTriple(incomingGameState.oponentChoices))
  }

  function sendMessage(message: string) {
    setGameState(
      (current) =>
        current && {
          ...current,
          messages: [
            ...current.messages,
            {
              timestamp: Date.now(),
              content: message,
              sender: 'you',
            },
          ],
        },
    )

    socketRef.current?.emit('message', message)
  }

  const forfeit = useCallback(async () => {
    await socketRef.current?.emitWithAck('forfeit')
  }, [])

  const connectGame = useCallback(
    async (matchId: string) => {
      socketRef.current?.disconnect()

      resetGameState()

      const newSocket = await getEventfulSocket(matchId)
      socketRef.current = newSocket
      setGameState({
        gameStatus: GameStatus.Waiting,
        matchId,
        messages: [],
        turn: null,
        player: {
          choices: [],
        },
        oponent: {
          choices: [],
        },
      })
      newSocket.emitWithAck('ready', {})
    },
    [gameState, getEventfulSocket, setGameState, resetGameState],
  )

  function disconnect() {
    socketRef.current?.disconnect()
    socketRef.current = null
    setGameState(null)
  }

  const availableChoices = useMemo(() => {
    if (!gameState) return []

    const availableChoices: Choice[] = []

    for (let i = 1; i < 10; i++) {
      if (
        !gameState.player.choices.includes(i as Choice) &&
        !gameState.oponent.choices.includes(i as Choice)
      )
        availableChoices.push(i as Choice)
    }

    return availableChoices
  }, [gameState])

  // Auto connects the user to the current game that is being played.
  useEffect(() => {
    async function checkStatus() {
      if (!logged) return
      const token = await getToken()
      if (!token) return
      const response = await Api.get('/matchId', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        connectGame(response.data.id)
      }
    }

    checkStatus()
  }, [getToken, logged])

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    if (oponentProfile)
      unsubscribe = models.users.subscribe(oponentProfile?._id, (data) => {
        setOponentProfile(data)
      })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [oponentProfile?._id])

  return (
    <GameContext.Provider
      value={{
        gameState,
        playerTimer: playerTimer.current,
        oponentTimer: oponentTimer.current,
        availableChoices,
        winningTriple: triple,
        oponentProfile,

        /** Se conecta a um jogo a partir de um token. */
        connectGame,
        makeChoice,
        disconnect,
        sendMessage,
        forfeit,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
