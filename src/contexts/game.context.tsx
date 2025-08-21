import { useGateway } from '@/hooks/use-gateway'
import { useListener } from '@/hooks/use-listener'
import { useObservable } from '@/hooks/use-observable'
import { Timer } from '@/lib/Timer'
import { Console } from '@/lib/console'
import {
  Choice,
  GameClientEventsMap,
  GameServerEventsMap,
  MatchClientEvents,
  MatchReportPayload,
  MatchServerEvents,
  Team,
  UserPayload,
} from '@magic3t/types'
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
import { IoGameController } from 'react-icons/io5'
import { AuthState, useAuth } from './auth.context'
import { useLiveActivity } from './live-activity.context'
import { NestApi } from '@/services'

type Message = { sender: 'you' | 'him'; content: string; timestamp: number }

type GameData2 = {
  matchId: string | null
  isActive: boolean
  turn: Team | null
  currentTeam: Team | null
  availableChoices: Choice[]
  finished: boolean
  finalReport: MatchReportPayload | null
  teams: Record<
    Team,
    {
      timer: Timer
      profile: UserPayload | null
      choices: Choice[]
      gain: number | null
      score: number | null
    }
  >

  connect(id: string): void
  disconnect(): void

  pick(choice: Choice): void
  sendMessage(message: string): void
  forfeit(): void

  onMatchReport(callback: (report: MatchReportPayload) => void): void
}

interface Props {
  children?: ReactNode
}

function teamName(team: Team | null): string {
  switch (team) {
    case Team.Order:
      return 'Order'
    case Team.Chaos:
      return 'Chaos'
    default:
      return 'null'
  }
}

const GameContext = createContext<GameData2>({} as GameData2)

// Refactor this and use white and black isntead of player and opponent
export function GameProvider({ children }: Props) {
  const auth = useAuth()
  const [matchId, setMatchId] = useState<string | null>(null)
  const isActive = !!matchId
  const [orderProfile, setOrderProfile] = useState<UserPayload | null>(null)
  const [chaosProfile, setChaosProfile] = useState<UserPayload | null>(null)
  const [orderChoices, setOrderChoices] = useState<Choice[]>([])
  const [chaosChoices, setChaosChoices] = useState<Choice[]>([])
  const [turn, setTurn] = useState<Team | null>(null)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [finalReport, setFinalReport] = useState<MatchReportPayload | null>(
    null
  )
  const [subscribeFinishMatch, emitFinishMatch] =
    useObservable<MatchReportPayload>()

  const orderTimer = useRef(new Timer(0))
  const chaosTimer = useRef(new Timer(0))

  const { getToken, authState } = useAuth()
  const gateway = useGateway<GameServerEventsMap, GameClientEventsMap>(
    'match',
    authState === AuthState.SignedIn
  )
  const { push } = useLiveActivity()

  // Handles text messages from the server. To be done.
  useListener(gateway, MatchServerEvents.Message, (message) => {
    setMessages((current) => [
      ...current,
      {
        timestamp: Date.now(),
        content: message.message,
        sender: 'him',
      },
    ])
  })

  // Handles team assignments messages from the server.
  useListener(
    gateway,
    MatchServerEvents.Assignments,
    (assignments) => {
      Console.log('Assignments received:')
      Console.log(`    order: ${assignments[Team.Order].profile.nickname}`)
      Console.log(`    chaos: ${assignments[Team.Chaos].profile.nickname}`)
      Console.log(
        `You are playing as: ${assignments[Team.Chaos].profile.id === auth.user?.id ? 'chaos' : 'order'}.`
      )
      Console.log()

      setOrderProfile(assignments[Team.Order].profile)
      setChaosProfile(assignments[Team.Chaos].profile)

      if (assignments[Team.Order].profile.id === auth.user?.id) {
        setCurrentTeam(Team.Order)
      } else if (assignments[Team.Chaos].profile.id === auth.user?.id) {
        setCurrentTeam(Team.Chaos)
      } else {
        setCurrentTeam(null)
      }
    },
    [auth.user?.id]
  )

  // Handles state updates from the server.
  useListener(gateway, MatchServerEvents.StateReport, (report) => {
    Console.log('New state received:')
    Console.log(`    turn:     ${teamName(report.turn)}`)
    Console.log(`    finished: ${report.finished}`)
    Console.log('    order:')
    Console.log(`        time left: ${report[Team.Order].timeLeft / 1000}`)
    Console.log(`        choices:   ${report[Team.Order].choices.join(', ')}`)
    Console.log(`        surrender: ${report[Team.Order].surrender}`)
    Console.log('    chaos:')
    Console.log(`        time left: ${report[Team.Chaos].timeLeft / 1000}`)
    Console.log(`        choices:   ${report[Team.Chaos].choices.join(', ')}`)
    Console.log(`        surrender: ${report[Team.Chaos].surrender}`)
    Console.log()

    setTurn(report.turn)
    setOrderChoices(report[Team.Order].choices)
    setChaosChoices(report[Team.Chaos].choices)
    orderTimer.current.pause()
    chaosTimer.current.pause()
    orderTimer.current.setRemaining(report[Team.Order].timeLeft)
    chaosTimer.current.setRemaining(report[Team.Chaos].timeLeft)

    if (report.turn === Team.Order) {
      orderTimer.current.start()
    } else if (report.turn === Team.Chaos) {
      chaosTimer.current.start()
    }
  })

  // Handles final match reports from the server.
  useListener(
    gateway,
    MatchServerEvents.MatchReport,
    (report) => {
      Console.log('Match finished:')
      Console.log(`    id: ${report.matchId}`)
      Console.log('    order:')
      Console.log(`        score: ${report[Team.Order].score}`)
      Console.log(`        lp_gain: ${report[Team.Order].lpGain}`)
      Console.log(
        `        rating: ${report[Team.Order].newRating.league} ${report[Team.Order].newRating.division} - ${report[Team.Order].newRating.points} LP`
      )
      Console.log('    chaos:')
      Console.log(`        score: ${report[Team.Chaos].score}`)
      Console.log(`        lp_gain: ${report[Team.Chaos].lpGain}`)
      Console.log(
        `        rating: ${report[Team.Chaos].newRating.league} ${report[Team.Chaos].newRating.division} - ${report[Team.Chaos].newRating.points} LP`
      )
      Console.log(`    winner: ${teamName(report.winner)}`)
      Console.log()

      setOrderProfile((old) => {
        return (
          old && {
            ...old,
            rating: report[Team.Order].newRating,
          }
        )
      })
      setChaosProfile((old) => {
        return (
          old && {
            ...old,
            rating: report[Team.Chaos].newRating,
          }
        )
      })
      setFinalReport(report)
      emitFinishMatch(report)
      auth.refreshUser()
    },
    [gateway.socket, auth.refreshUser]
  )

  // Refactor with keys
  const resetState = useCallback(() => {
    setMatchId(null)
    setTurn(null)
    setMessages([])
    orderTimer.current.pause()
    chaosTimer.current.pause()
    orderTimer.current.setRemaining(0)
    chaosTimer.current.setRemaining(0)
    setOrderProfile(null)
    setChaosProfile(null)
    setOrderChoices([])
    setChaosChoices([])
    setFinalReport(null)
    setCurrentTeam(null)
  }, [])

  // Requests game state and game assignments whenever a new game starts.
  useEffect(() => {
    if (!matchId) return
    if (!gateway.socket) return

    gateway.emit(MatchClientEvents.GetState)
    gateway.emit(MatchClientEvents.GetAssignments)
  }, [matchId, gateway])

  useListener(gateway, 'disconnect', (reason) => {
    console.error('Socket disconnected because of', `${reason}.`)
    Console.log(`Socket disconnected because of ${reason}.`)
  })

  const pick = useCallback(
    (choice: Choice) => {
      if (currentTeam === null) return
      if (currentTeam !== turn) return
      gateway.emit(MatchClientEvents.Pick, choice)
      switch (currentTeam) {
        case Team.Order: {
          setOrderChoices((old) => [...old, choice])
          setTurn(Team.Chaos)
          orderTimer.current.pause()
          chaosTimer.current.start()
          break
        }
        case Team.Chaos: {
          setChaosChoices((old) => [...old, choice])
          setTurn(Team.Order)
          chaosTimer.current.pause()
          orderTimer.current.start()
          break
        }
      }
    },
    [currentTeam, turn, gateway.emit]
  )

  const sendMessage = useCallback(
    (message: string) => {
      if (gateway.socket) {
        setMessages((current) => [
          ...current,
          {
            content: message,
            sender: 'you',
            timestamp: Date.now(),
          },
        ])

        gateway.emit(MatchClientEvents.Message, message)
      }
    },
    [gateway]
  )

  const forfeit = useCallback(async () => {
    if (currentTeam === null) return
    if (finalReport) return

    Console.log('You surrendered the match.')
    Console.log()

    gateway.emit(MatchClientEvents.Surrender)
    setTurn(null)
    orderTimer.current.pause()
    chaosTimer.current.pause()
  }, [currentTeam, finalReport, gateway])

  // Sets the state as connected to a game by just setting a matchId different from null.
  const connectGame = useCallback(
    (matchId: string) => {
      Console.log(`Connected to match ${matchId}.`)
      Console.log()
      resetState()
      setMatchId(matchId)
    },
    [resetState]
  )

  function disconnect() {
    setMatchId(null)
    resetState()
  }

  const availableChoices = useMemo(() => {
    if (!isActive) return []
    const availableChoices: Choice[] = []
    for (let i = 1; i < 10; i++) {
      if (
        !orderChoices.includes(i as Choice) &&
        !chaosChoices.includes(i as Choice)
      )
        availableChoices.push(i as Choice)
    }
    return availableChoices
  }, [orderChoices, chaosChoices, isActive])

  // If the player was currently in a game, auto connects him to the game when he logs in.
  useEffect(() => {
    async function checkStatus() {
      try {
        if (authState !== AuthState.SignedIn) return
        const token = await getToken()
        if (!token) return
        const { id } = await NestApi.Match.getCurrentMatch(token)
        await connectGame(id)
      } catch (e) {
        console.error(e)
        Console.log((e as unknown as Error).message)
      }
    }

    checkStatus()
  }, [getToken, connectGame, authState])

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
      value={{
        teams: {
          [Team.Order]: {
            choices: orderChoices,
            profile: orderProfile,
            timer: orderTimer.current,
            gain: finalReport?.[Team.Order].lpGain || null,
            score: finalReport?.[Team.Order].score || null,
          },
          [Team.Chaos]: {
            choices: chaosChoices,
            profile: chaosProfile,
            timer: chaosTimer.current,
            gain: finalReport?.[Team.Chaos].lpGain || null,
            score: finalReport?.[Team.Chaos].score || null,
          },
        },
        availableChoices,
        isActive,
        matchId,
        finalReport,
        currentTeam,
        finished: !!finalReport,
        turn,
        connect: connectGame,
        disconnect,
        forfeit,
        pick,
        sendMessage,
        onMatchReport: subscribeFinishMatch,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
