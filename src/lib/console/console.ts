import { useSyncExternalStore } from 'react'
import { Channel } from '../channel'
import { Observer } from '../observable'
import { delay } from '../utils'
import { PublicEmitter } from './emitter'
import { initialCmds, INITIAL_CVARS } from './initials'
import { CVar, CVarValue } from './cvar'

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
  private static cvarsMap: Map<string, CVar> = new Map(
    INITIAL_CVARS.map((cvar) => [cvar.name, cvar])
  )
  private static cmds: Record<string, CommandHandler> = { ...initialCmds }
  private static queue: Channel<Operation> = new Channel()
  private static emitter = new PublicEmitter()

  static {
    async function operationLoop() {
      while (true) {
        const operation = await Console.queue.receive()
        await operation()
      }
    }

    operationLoop()
  }

  public static getCvarValue(name: string): CVarValue | null {
    return Console.cvarsMap.get(name)?.value ?? null
  }

  public static useCvar(cvar: string): CVarValue | null {
    return useSyncExternalStore(
      (callback) => {
        return Console.on('changeCvar', (changedCvar) => {
          if (changedCvar === cvar) {
            callback()
          }
        })
      },
      () => Console.cvarsMap.get(cvar)?.value ?? null
    )
  }

  public static log(message?: string) {
    console.log(message)
    Console.lines = [...Console.lines, message ?? '']
    if (Console.lines.length > BUFFER_SIZE) Console.lines.shift()
    Console.emitter.publicEmit('changeBuffer')
  }

  public static set(cvar: string, valueString: string) {
    Console.queue.send(() => {
      const cvarObj = Console.cvarsMap.get(cvar)

      if (!cvarObj) {
        Console.log(`CVar '${cvar}' does not exist`)
        return
      }

      if (cvarObj.readonly) {
        Console.log(`CVar '${cvar}' is read-only`)
        return
      }

      switch (cvarObj.type) {
        case 'string': {
          cvarObj.value = valueString
          break
        }

        case 'number': {
          const num = Number(valueString)
          if (Number.isNaN(num)) {
            Console.log(`CVar '${cvar}' requires a numeric value`)
            return
          }
          if (cvarObj.integer && !Number.isInteger(num)) {
            Console.log(`CVar '${cvar}' requires an integer value`)
            return
          }
          if (num < cvarObj.min || num > cvarObj.max) {
            Console.log(
              `CVar '${cvar}' requires a value between ${cvarObj.min} and ${cvarObj.max}`
            )
            return
          }

          cvarObj.value = num
          break
        }

        case 'boolean': {
          if (valueString === '1' || valueString.toLowerCase() === 'true') {
            cvarObj.value = true
            break
          }
          if (valueString === '0' || valueString.toLowerCase() === 'false') {
            cvarObj.value = false
            break
          }
          Console.log(
            `CVar '${cvar}' requires a boolean value (0/1 or true/false)`
          )
          return
        }
      }
      Console.log(`CVar '${cvar}' set to ${JSON.stringify(cvarObj.value)}`)
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
      if (!Console.cmds[command] && !Console.cvarsMap.get(command)) {
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
        Console.set(command, args)
        return
      }

      const cvar = Console.cvarsMap.get(command)!

      Console.log(`${command} = '${cvar.value}'`)
    })
  }

  public static cmdlist() {
    const commandsList = Object.keys(Console.cmds).sort()
    Console.queue.send(() => {
      for (const command of commandsList) Console.log(command)
      Console.log(`Listed ${commandsList.length} commands`)
    })
  }

  public static getCvars(): CVar[] {
    return Array.from(Console.cvarsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  public static resetCvars() {
    Console.queue.send(() => {
      for (const cvar of Console.cvarsMap.values()) {
        if (cvar.readonly) continue
        cvar.value = cvar.default
        Console.emitter.publicEmit('changeCvar', cvar.name)
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
