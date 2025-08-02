import { Observable } from '@/lib/observable'

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
  cvarlist(_, ctx) {
    const cvars = Object.entries(ctx.cvars).map(
      ([key, value]) => `${key} = '${value}'`
    )
    for (const cvar of cvars) {
      ctx.log(cvar)
    }
  },
  cmdlist(_, ctx) {
    const commandsList = Object.keys(initialCmds).sort()
    for (const command of commandsList) {
      ctx.log(command)
    }
  },
}

export type CommandHandler = (args: string, ctx: Console) => void

export class Console extends Observable<ConsoleEventsMap> {
  private buffer: string[] = Array(BUFFER_SIZE).fill(null)
  private buffer_head = 0
  private _cvars: Record<string, string> = initialCvars
  private cmds: Record<string, CommandHandler> = {}

  public get cvars() {
    return Object.freeze(this._cvars)
  }

  public get lines() {
    return [
      ...this.buffer.slice(this.buffer_head),
      ...this.buffer.slice(0, this.buffer_head),
    ].filter((line) => line !== null)
  }

  public log(message?: string) {
    this.buffer[this.buffer_head] = message ?? ''
    this.buffer_head = (this.buffer_head + 1) % BUFFER_SIZE
    this.emit('changeBuffer')
  }

  public set(cvar: string, value: string) {
    this._cvars[cvar] = value
    this.emit('changeCvar', cvar)
  }

  public run(line: string) {
    const [command, args] = Console.parse(line)
    if (!command) return

    if (!this.cmds[command] && !this.cvars[command]) {
      this.log(`Unknown command '${command}'`)
      return
    }

    // If the command is a registered command, execute it
    if (this.cmds[command]) {
      this.cmds[command](args, this)
      return
    }

    // If the command is a cvar, set or get its value
    if (args) {
      this.log(`${command} set to '${args}'`)
      this.set(command, args)
      return
    }

    this.log(`${command} = '${this.cvars[command]}'`)
  }

  public static parse(line: string): [command: string, args: string] {
    const trimmed = line.toLowerCase().trimStart()
    const command = trimmed.split(' ')[0]
    let args = trimmed.replace(command, '')
    if (args.startsWith(' ')) args = args.slice(1)

    return [command, args]
  }
}
