import { useSyncExternalStore } from 'react'
import { Channel } from '../channel'
import { Observer } from '../observable'
import { PublicEmitter } from './emitter'
import { CVar, CVarValue, INITIAL_CVARS } from './cvars'
import { Cmd, ConsoleContext, INITIAL_CMDS } from './commands'

const BUFFER_SIZE = 128

interface ConsoleEventsMap {
  changeCvar: (cvar: string) => void
  changeBuffer: () => void
}

export type CommandHandler = (args: string) => void | Promise<void>

export type ConsoleResult<T> = Result<T, string>

type Operation = () => ConsoleResult<[]> | Promise<ConsoleResult<[]>>
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Console {
  public static lines: string[] = []
  private static cvarsMap: Map<string, CVar> = new Map(
    INITIAL_CVARS.map((cvar) => [cvar.name, cvar])
  )
  private static cmdsMap: Map<string, Cmd> = new Map(
    INITIAL_CMDS.map((cmd) => [cmd.name, cmd])
  )

  // private static cmds: Record<string, CommandHandler> = { ...initialCmds }
  private static queue: Channel<Operation> = new Channel()
  private static emitter = new PublicEmitter()

  private static context: ConsoleContext = {
    print: Console.log,
    clear: Console.clear,
    execCmd: () => Promise.reject('Not implemented'),
    getCvar: (name: string) => Console.cvarsMap.get(name) ?? null,
    listCmds: () => Array.from(Console.cmdsMap.values()),
    listCvars: () => Array.from(Console.cvarsMap.values()),
    setCvar: Console.setInner,
  }

  static {
    async function operationLoop() {
      for (;;) {
        const operation = await Console.queue.receive()
        try {
          const _result = await operation()
        } catch (e) {
          console.error(e)
        }
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
    Console.queue.send(() => Console.setInner(cvar, valueString))
  }

  public static clear() {
    Console.lines = []
    Console.emitter.publicEmit('changeBuffer')
  }

  public static async exec(line: string) {
    const { cmd: cmdName, args } = Console.parse(line)
    if (!cmdName) return
    const command = Console.cmdsMap.get(Console.slug(cmdName))

    await Console.queue.send(async () => {
      // If the command is not a registered command, check if it's a cvar
      if (!command) {
        const cvar = Console.cvarsMap.get(cmdName)
        if (!cvar) {
          Console.log(`Unknown command '${cmdName}'`)
          return Err(`Unknown command '${cmdName}'`)
        }

        if (args.length > 0) {
          Console.set(cmdName, args[0])
        } else {
          Console.inspectCvar(cvar)
        }

        return Ok([])
      }

      // If the command is a registered command, execute it
      const result = await command.handler({
        args,
        console: Console.context,
      })

      return Ok([])
    })
  }

  public static addCommand(cmd: Cmd): () => void {
    const prev = Console.cmdsMap.get(cmd.name)

    Console.cmdsMap.set(Console.slug(cmd.name), cmd)
    return () => {
      if (prev) Console.cmdsMap.set(Console.slug(prev.name), prev)
      else Console.cmdsMap.delete(Console.slug(cmd.name))
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

  private static inspectCvar(cvar: CVar) {
    const str = `${cvar.name} = ${JSON.stringify(cvar.value)} (default: ${JSON.stringify(cvar.default)})`
    Console.log(str)
    Console.log(cvar.description)
  }

  private static slug(name: string): string {
    return name.toLowerCase()
  }
  private static setInner(
    cvar: string,
    valueString: string
  ): ConsoleResult<[]> {
    const cvarObj = Console.cvarsMap.get(cvar)

    if (!cvarObj) {
      return Err(`CVar '${cvar}' does not exist`)
    }

    if (cvarObj.readonly) {
      return Err(`CVar '${cvar}' is read-only`)
    }

    switch (cvarObj.type) {
      case 'string': {
        cvarObj.value = valueString
        break
      }

      case 'number': {
        const num = Number(valueString)
        if (Number.isNaN(num)) {
          return Err(`CVar '${cvar}' requires a numeric value`)
        }
        if (cvarObj.integer && !Number.isInteger(num)) {
          return Err(`CVar '${cvar}' requires an integer value`)
        }
        if (num < cvarObj.min || num > cvarObj.max) {
          return Err(
            `CVar '${cvar}' requires a value between ${cvarObj.min} and ${cvarObj.max}`
          )
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
        return Err(
          `CVar '${cvar}' requires a boolean value (0/1 or true/false)`
        )
      }
    }
    Console.emitter.publicEmit('changeCvar', cvar)
    return Ok([])
  }

  private static parse(line: string): { cmd: string; args: string[] } {
    const args: string[] = []
    let doubleQuotes = false
    let singleQuotes = false
    let escaping = false
    let currentArg = ''

    function push() {
      if (currentArg.length > 0) {
        args.push(currentArg)
        currentArg = ''
      }
    }

    for (const char of line) {
      if (escaping) {
        currentArg += char
        escaping = false
        continue
      }

      if (char === '\\') {
        escaping = true
        continue
      }

      if (singleQuotes) {
        if (char === "'") {
          args.push(currentArg)
          currentArg = ''
          singleQuotes = false
          continue
        }
        currentArg += char
        continue
      }

      if (doubleQuotes) {
        if (char === '"') {
          args.push(currentArg)
          currentArg = ''
          doubleQuotes = false
          continue
        }
        currentArg += char
        continue
      }

      if (char === '"') {
        push()
        doubleQuotes = true
        continue
      }

      if (char === "'") {
        push()
        singleQuotes = true
        continue
      }

      if (char === ' ') {
        push()
        continue
      }

      currentArg += char
    }
    push()

    return {
      cmd: args.shift() ?? '',
      args,
    }
  }
}
