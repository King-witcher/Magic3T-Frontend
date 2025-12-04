import { NestApi } from '@/services'
import { io } from 'socket.io-client'
import { CVar, SystemCvars } from './cvars'

export type ConsoleContext = Readonly<{
  print: (message: string) => void
  clear: () => void
  getCvar: (cvar: string) => CVar | null
  setCvar: (cvar: string, valueString: string) => Result<[], string>
  listCmds: () => Cmd[]
  listCvars: () => CVar[]
  execCmd: (line: string, ctx?: CmdContext) => Promise<number>
}>

export type CmdContext = {
  args: string[]
  console: ConsoleContext
}

export type Cmd = {
  name: string
  description: string
  handler: (ctx: CmdContext) => Promise<number>
}

export const INITIAL_CMDS: Cmd[] = [
  {
    name: 'clear',
    description: 'Clears the console buffer',
    async handler({ console }: CmdContext) {
      console.clear()
      return 0
    },
  },
  {
    name: 'cmdlist',
    description: 'Lists all available commands',
    async handler({ console }: CmdContext) {
      const cmds = console
        .listCmds()
        .sort((a, b) => a.name.localeCompare(b.name))

      for (const cmd of cmds) {
        let line = cmd.name
        line += ' '.repeat(Math.max(0, 20 - line.length))
        line += `// ${cmd.description}`
        console.print(line)
      }
      console.print(`Listed ${cmds.length} commands`)
      return 0
    },
  },
  {
    name: 'cvarlist',
    description: 'Lists all available cvars',
    async handler({ console }: CmdContext) {
      const cvars = console
        .listCvars()
        .sort((a, b) => a.name.localeCompare(b.name))

      for (const cvar of cvars) {
        let line = cvar.name
        line += ' '.repeat(Math.max(0, 20 - line.length))
        line += '= '
        line += JSON.stringify(cvar.value)
        line += ' '.repeat(Math.max(0, 60 - line.length))
        line += `// ${cvar.description ?? 'No description'}`
        console.print(line)
      }
      console.print(`Listed ${cvars.length} cvars`)
      return 0
    },
  },
  {
    name: 'delay',
    description: 'Delays execution for a specified number of milliseconds',
    async handler({ args, console }: CmdContext) {
      const ms = Number(args[0])
      if (Number.isNaN(ms) || ms < 0) {
        console.print('Usage: delay <ms>')
        return 1
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0)
        }, ms)
      })
    },
  },
  {
    name: 'echo',
    description: 'Prints the provided arguments to the console',
    async handler({ args, console }: CmdContext) {
      console.print(args.join(' '))
      return 0
    },
  },
  {
    name: 'resetcvars',
    description: 'Resets all cvars to their default values',
    async handler({ console }: CmdContext) {
      for (const cvar of console.listCvars()) {
        if (cvar.readonly) continue
        cvar.value = cvar.default
      }
      console.print('All cvars have been reset to their default values')
      return 0
    },
  },
  {
    name: 'ping',
    description: 'Pings the server and returns the latency',
    async handler({ console }: CmdContext) {
      const http = await pingHttp()
      console.print(`HTTP: ${http}ms`)
      const url = console.getCvar(SystemCvars.SvApiUrl)!.value as string
      const ws = await pingWs(url)
      console.print(`WS: ${ws}ms`)
      return 0
    },
  },
  {
    name: 'set',
    description: 'Sets the value of a cvar',
    async handler({ args, console }: CmdContext) {
      const cvarName = args[0]
      const value = args[1]
      if (!cvarName || !value) {
        console.print('Usage: set <cvar> <value>')
        return 1
      }
      const result = console.setCvar(cvarName, value)
      if (result.is_err()) {
        return 1
      }
      return 0
    },
  },
]

async function pingHttp(): Promise<number> {
  const now = Date.now()
  await NestApi.getStatus()
  return Date.now() - now
}

async function pingWs(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const socket = io(url)

    socket.on('connect', () => {
      const timeout = setTimeout(() => {
        socket.disconnect()
        reject('WS ping timed out')
      }, 5000)

      const rng = Math.floor(Math.random() * 1000000)

      socket.on('pong', (arg: unknown) => {
        if (arg !== rng) return
        const elapsed = Date.now() - now
        socket.disconnect()
        clearTimeout(timeout)
        resolve(elapsed)
      })

      const now = Date.now()
      socket.emit('ping', rng)
    })
  })
}
