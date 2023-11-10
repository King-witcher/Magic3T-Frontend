import { Timer } from '@/lib/Timer'
import { compareArrays } from '@/lib/utils'
import { Choice, GameStateReport, GameStatus } from '@/types/types'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'

type Message = { sender: string; content: string; timestamp: number }

interface GameState {
  player: {
    choices: Choice[]
    time: Timer
  }
  oponent: {
    profile: Profile | null
    choices: Choice[]
    time: Timer
  }
  gameStatus: GameStatus
  turn: 'player' | 'oponent' | null
  triple: [Choice | 0, Choice | 0, Choice | 0]
  matchId: string | null
  messages: Message[]
}

interface GameData {
  gameState: GameState | null
  availableChoices: Choice[]

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
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  /**Limpa o estado do jogo, colocando os timers em 0. */
  const resetGameState = useCallback(() => {
    setGameState(null)
  }, [])

  const getEventfulSocket = useCallback(
    async (matchId: string) => {
      const token = await user?.getIdToken()
      if (!token) throw new Error('No Id Token')
      const socket = io(`${import.meta.env.VITE_API_URL}/match`, {
        auth: { matchId, token },
      })

      return socket
        .on('gameState', handleServerGameState)
        .on('disconnect', handleServerDisconnect)
        .on('message', handleReceiveMessage)
        .on('oponentProfile', (profile) => {
          setGameState(
            (current) =>
              current && {
                ...current,
                oponent: {
                  ...current.oponent,
                  profile,
                },
              },
          )
        })
        .on('connect', () => {
          socket.emit('getOponentProfile')
        })
    },
    [user],
  )

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
              sender: current.oponent.profile?.name || 'Anônimo',
            },
          ],
        },
    )
  }, [])

  const makeChoice = useCallback(
    (choice: Choice) => {
      socket?.emit('choice', choice)

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

      gameState?.player.time.pause()
      gameState?.oponent.time.pause()
    },
    [socket, gameState],
  )

  function handleServerDisconnect() {
    setSocket(null)
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

    gameState?.player.time.setRemaining(incomingGameState.playerTimeLeft)
    gameState?.oponent.time.setRemaining(incomingGameState.oponentTimeLeft)

    // Define o terno de números vencedor.
    function getTriple(
      numbers: Choice[],
    ): [Choice | 0, Choice | 0, Choice | 0] {
      for (let i = 0; i < numbers.length - 2; i++)
        for (let j = 1; j < numbers.length - 1; j++)
          for (let k = 2; k < numbers.length; k++)
            if (numbers[i] + numbers[j] + numbers[k] === 15)
              return [numbers[i], numbers[j], numbers[k]]
      return [0, 0, 0]
    }

    // Refazer!
    // if (incomingGameState.status === GameStatus.Victory)
    //   setTriple(getTriple(incomingGameState.playerChoices))
    // else if (incomingGameState.status === GameStatus.Defeat)
    //   setTriple(getTriple(incomingGameState.oponentChoices))
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
              sender: 'Você',
            },
          ],
        },
    )

    socket?.emit('message', message)
  }

  const forfeit = useCallback(async () => {
    await socket?.emitWithAck('forfeit')
  }, [socket])

  const connectGame = useCallback(
    async (matchId: string) => {
      socket?.disconnect()

      resetGameState()

      const newSocket = await getEventfulSocket(matchId)
      setSocket(newSocket)
      setGameState({
        gameStatus: GameStatus.Waiting,
        matchId,
        messages: [],
        turn: null,
        triple: [0, 0, 0],
        player: {
          choices: [],
          time: new Timer(0),
        },
        oponent: {
          choices: [],
          time: new Timer(0),
          profile: {
            name: '',
            photoUrl: '',
            rating: 0,
            uid: '',
          },
        },
      })
      newSocket.emitWithAck('ready', {})
    },
    [gameState, socket, getEventfulSocket, setGameState],
  )

  function disconnect() {
    socket?.disconnect()
    setSocket(null)
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

  useEffect(() => {
    if (gameState) {
      navigate('/game')
    }
  }, [gameState])

  useEffect(() => {
    return () => {
      socket?.disconnect()
    }
  }, [])

  return (
    <GameContext.Provider
      value={{
        gameState,
        availableChoices,

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
