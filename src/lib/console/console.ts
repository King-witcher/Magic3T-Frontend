import { Observer } from '../observable'
import { PublicEmitter } from './emitter'

const BUFFER_SIZE = 128

interface ConsoleEventsMap {
  changeCvar: (cvar: string) => void
  changeBuffer: () => void
}

const initialCvars: Record<string, string> = {
  '3tmode': '0',
  pugmode: '0',
  apiurl: import.meta.env.VITE_API_URL,
}

const initialCmds: Record<string, CommandHandler> = {
  echo(args) {
    Console.log(args)
  },
  set(args) {
    const [cvar, value] = args.split(' ')
    if (!cvar || !value) {
      Console.log('Usage: set <cvar> <value>')
      return
    }
    Console.set(cvar, value)
    Console.log(`Set ${cvar} to ${value}`)
  },
  clear() {
    Console.clear()
  },
  cvarlist(_) {
    const cvars = Object.entries(Console.cvars).sort((a, b) =>
      a[0].localeCompare(b[0])
    )
    for (const [key, value] of cvars) {
      const nameLength = key.length
      const padding = ' '.repeat(Math.max(0, 20 - nameLength))
      Console.log(`${key} ${padding}= '${value}'`)
    }
    Console.log(`Listed ${cvars.length} cvars`)
  },
  cmdlist(_) {
    const commandsList = Object.keys(initialCmds).sort()
    for (const command of commandsList) {
      Console.log(command)
    }
    Console.log(`Listed ${commandsList.length} commands`)
  },
}

export type CommandHandler = (args: string) => void

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Console {
  public static lines: string[] = []
  private static _cvars: Record<string, string> = initialCvars
  private static cmds: Record<string, CommandHandler> = initialCmds
  private static emitter = new PublicEmitter()

  public static get cvars() {
    return Object.freeze(Console._cvars)
  }

  public static log(message?: string) {
    Console.lines = [...Console.lines, message ?? '']
    if (Console.lines.length > BUFFER_SIZE) Console.lines.shift()
    Console.emitter.publicEmit('changeBuffer')
  }

  public static set(cvar: string, value: string) {
    Console._cvars[cvar] = value
    Console.emitter.publicEmit('changeCvar', cvar)
  }

  public static clear() {
    Console.lines = []
    Console.emitter.publicEmit('changeBuffer')
  }

  public static run(line: string) {
    const [command, args] = Console.parse(line)
    if (!command) return

    if (!Console.cmds[command] && !Console.cvars[command]) {
      Console.log(`Unknown command '${command}'`)
      return
    }

    // If the command is a registered command, execute it
    if (Console.cmds[command]) {
      Console.cmds[command](args)
      return
    }

    // If the command is a cvar, set or get its value
    if (args) {
      Console.log(`${command} set to '${args}'`)
      Console.set(command, args)
      return
    }

    Console.log(`${command} = '${Console.cvars[command]}'`)
  }

  public static on<Event extends keyof ConsoleEventsMap>(
    event: Event,
    observer: Observer<ConsoleEventsMap, Event>
  ): () => void {
    return Console.emitter.on(event, observer)
  }

  public static onMany<Event extends keyof ConsoleEventsMap>(
    events: Event[],
    observer: Observer<ConsoleEventsMap, Event>
  ): () => void {
    return Console.emitter.onMany(events, observer)
  }

  public static addCommand(cmd: string, handler: CommandHandler) {
    const slug = cmd.toLowerCase()
    Console.cmds[slug] = handler
    return () => {
      delete Console.cmds[slug]
    }
  }

  public static parse(line: string): [command: string, args: string] {
    const trimmed = line.toLowerCase().trimStart()
    const command = trimmed.split(' ')[0]
    let args = trimmed.replace(command, '')
    if (args.startsWith(' ')) args = args.slice(1)

    return [command, args]
  }
}
