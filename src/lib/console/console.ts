import { Channel } from '../channel'
import { Observer } from '../observable'
import { delay } from '../utils'
import { PublicEmitter } from './emitter'
import { initialCmds, initialCvars } from './initials'

const BUFFER_SIZE = 128

interface ConsoleEventsMap {
  changeCvar: (cvar: string) => void
  changeBuffer: () => void
}

export type CommandHandler = (args: string) => void | Promise<void>

type Operation = () => void | Promise<void>

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Console {
  public static lines: string[] = []
  public static cvars: Record<string, string> = { ...initialCvars }
  private static cmds: Record<string, CommandHandler> = { ...initialCmds }
  private static queue: Channel<Operation> = new Channel()
  private static emitter = new PublicEmitter()

  static {
    async function loop() {
      while (true) {
        const operation = await Console.queue.receive()
        await operation()
      }
    }

    loop()
  }

  public static log(message?: string) {
    Console.queue.send(() => {
      Console.lines = [...Console.lines, message ?? '']
      if (Console.lines.length > BUFFER_SIZE) Console.lines.shift()
      Console.emitter.publicEmit('changeBuffer')
    })
  }

  public static set(cvar: string, value: string) {
    Console.queue.send(() => {
      Console.cvars[cvar] = value
      Console.emitter.publicEmit('changeCvar', cvar)
    })
  }

  public static clear() {
    Console.queue.send(() => {
      Console.lines = []
      Console.emitter.publicEmit('changeBuffer')
    })
  }

  public static run(line: string) {
    const [command, args] = Console.parse(line)
    if (!command) return

    Console.queue.send(async () => {
      if (!Console.cmds[command] && !Console.cvars[command]) {
        Console.log(`Unknown command '${command}'`)
        return
      }

      // If the command is a registered command, execute it
      const handler = Console.cmds[command]
      if (handler) {
        await handler(args)
        return
      }

      // If the command is a cvar, set or get its value
      if (args) {
        Console.log(`${command} set to '${args}'`)
        Console.set(command, args)
        return
      }

      Console.log(`${command} = '${Console.cvars[command]}'`)
    })
  }

  public static cmdlist() {
    const commandsList = Object.keys(Console.cmds).sort()
    Console.queue.send(() => {
      for (const command of commandsList) Console.log(command)
      Console.log(`Listed ${commandsList.length} commands`)
    })
  }

  public static resetCvars() {
    Console.queue.send(() => {
      Console.cvars = { ...initialCvars }
      for (const cvar in initialCvars) {
        Console.emitter.publicEmit('changeCvar', cvar)
      }

      Console.log('Cvars reset to initial values')
    })
  }

  public static wait(ms: number) {
    Console.queue.send(async () => {
      await delay(ms)
    })
  }

  public static addCommand(cmd: string, handler: CommandHandler) {
    const slug = cmd.toLowerCase()
    Console.cmds[slug] = handler
    return () => {
      delete Console.cmds[slug]
    }
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

  public static parse(line: string): [command: string, args: string] {
    const trimmed = line.toLowerCase().trimStart()
    const command = trimmed.split(' ')[0]
    let args = trimmed.replace(command, '')
    if (args.startsWith(' ')) args = args.slice(1)

    return [command, args]
  }
}
