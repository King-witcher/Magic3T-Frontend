import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react'

export type CommandContext = {
  log: (message?: string) => void
  set: (cvar: string, value: string) => void
  run: (command: string) => void
  cvars: {
    readonly [key: string]: string
  }
}
export type CommandHandler = (args: string, ctx: CommandContext) => void

const BUFFER_SIZE = 256

type Buffer = {
  lines: (string | null)[]
  head: number
}

const commands: Record<string, CommandHandler> = {
  echo(args, ctx) {
    ctx.log(args)
  },
  set(args, ctx) {
    const [cvar, value] = args.split(' ')
    if (!cvar || !value) {
      ctx.log('Usage: set <cvar> <value>')
      return
    }
    ctx.set(cvar, value)
    ctx.log(`Set ${cvar} to ${value}`)
  },
  cvarlist(args, ctx) {
    const cvars = Object.entries(ctx.cvars).map(
      ([key, value]) => `${key} = '${value}'`
    )
    for (const cvar of cvars) {
      ctx.log(cvar)
    }
  },
  cmdlist(args, ctx) {
    const commandsList = Object.keys(commands).sort()
    for (const command of commandsList) {
      ctx.log(command)
    }
  },
}

export function addCommand(command: string, func: CommandHandler): () => void {
  const slug = command.toLowerCase()
  commands[slug] = func
  return () => delete commands[slug]
}

interface ConsoleData {
  lines: (string | null)[]
  cvars: {
    readonly [key: string]: string
  }
  log: (message?: string) => void
  run: (command: string) => void
  set: (cvar: string, value: string) => void
}

interface Props {
  children: ReactNode
}

function parse(line: string): [command: string, args: string] {
  const trimmed = line.toLowerCase().trimStart()
  const command = trimmed.split(' ')[0]
  let args = trimmed.replace(command, '')
  if (args.startsWith(' ')) args = args.slice(1)

  return [command, args]
}

function logReducer(buffer: Buffer, message: string | undefined): Buffer {
  const { lines, head } = buffer
  const newLines = [...lines]
  newLines[head] = message ?? ''
  return {
    lines: newLines,
    head: (head + 1) % BUFFER_SIZE,
  }
}

const ConsoleContext = createContext<ConsoleData>({} as ConsoleData)

export function ConsoleProvider({ children }: Props) {
  const [buffer, log] = useReducer(logReducer, null, () => ({
    lines: new Array<string | null>(BUFFER_SIZE).fill(null),
    head: 0,
  }))

  const [cvars, setCvars] = useState<Record<string, string>>({
    '3tmode': '0',
    pugmode: '0',
    apiurl: import.meta.env.VITE_API_URL,
  })

  const lines = useMemo(() => {
    return [
      ...buffer.lines.slice(buffer.head, buffer.lines.length),
      ...buffer.lines.slice(0, buffer.head),
    ].filter((line) => line !== null)
  }, [buffer])

  const get = useCallback(
    (cvar: string) => {
      const value = cvars[cvar.toLowerCase()]
      return value ?? null
    },
    [cvars]
  )

  const set = useCallback((cvar: string, value: string) => {
    setCvars((current) => ({
      ...current,
      [cvar.toLowerCase()]: value,
    }))
  }, [])

  const run = useCallback(
    (line: string) => {
      const [command, args] = parse(line)
      if (!command) return
      if (!commands[command] && !cvars[command]) {
        log(`Unknown command '${command}'`)
        return
      }

      if (commands[command]) {
        commands[command](args, { log, cvars, set, run })
        return
      }

      if (args) {
        log(`${command} set to '${args}'`)
        set(command, args)
        return
      }

      log(`${command} = '${cvars[command]}'`)
    },
    [get, set, cvars]
  )

  const returnValue = useMemo<ConsoleData>(
    () => ({
      lines,
      cvars,
      log,
      run,
      set,
    }),
    [lines, run, cvars, set]
  )

  return (
    <ConsoleContext.Provider value={returnValue}>
      {children}
    </ConsoleContext.Provider>
  )
}

export const useConsole = () => useContext(ConsoleContext)
