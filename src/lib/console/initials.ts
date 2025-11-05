import { NestApi } from '@/services'
import { io } from 'socket.io-client'
import { CommandHandler, Console } from './console'
import { CVar } from './cvar'

export enum SystemCvars {
  ClStatusPoll = 'cl_statuspoll',
  ConStyle = 'con_style',
  SvApiUrl = 'sv_apiurl',
  Ui3TMode = 'ui_3tmode',
  UiPugMode = 'ui_pugmode',
}

export enum ConStyle {
  Default = 0,
  Q3 = 1,
}

export const INITIAL_CVARS: CVar[] = [
  {
    name: SystemCvars.ClStatusPoll,
    type: 'number',
    default: 5000,
    value: 5000,
    readonly: false,
    description: 'Interval for status polling',
    min: 50,
    max: Number.POSITIVE_INFINITY,
    integer: true,
  },
  {
    name: SystemCvars.ConStyle,
    type: 'number',
    default: ConStyle.Default,
    value: ConStyle.Default,
    min: ConStyle.Default,
    max: ConStyle.Q3,
    integer: true,
    readonly: false,
    description: 'Console style',
  },
  {
    name: SystemCvars.SvApiUrl,
    type: 'string',
    default: import.meta.env.VITE_API_URL,
    value: import.meta.env.VITE_API_URL,
    readonly: false,
    description: 'URL of the backend API',
  },
  {
    name: SystemCvars.Ui3TMode,
    type: 'boolean',
    value: false,
    default: false,
    readonly: false,
    description: 'Enable 3T mode cheat in the UI',
  },
  {
    name: SystemCvars.UiPugMode,
    type: 'boolean',
    value: false,
    default: false,
    readonly: false,
    description: 'Enable PUG mode in the UI',
  },
]

export const initialCmds: Record<string, CommandHandler> = {
  clear() {
    Console.clear()
  },

  cmdlist() {
    Console.cmdlist()
  },

  cvarlist() {
    const cvars = Console.getCvars()
    for (const cvar of cvars) {
      let line = cvar.name
      line += ' '.repeat(Math.max(0, 20 - line.length))
      line += '= '
      line += JSON.stringify(cvar.value)
      line += ' '.repeat(Math.max(0, 60 - line.length))
      line += `// ${cvar.description ?? 'No description'}`
      Console.log(line)
    }
    Console.log(`Listed ${cvars.length} cvars`)
  },

  delay(args) {
    const ms = Number(args.split(' ')[0])
    if (Number.isNaN(ms) || ms < 0) {
      Console.log('Usage: delay <ms>')
      return
    }
    Console.wait(ms)
  },

  echo(args) {
    Console.log(args)
  },

  async ping() {
    const http = await pingHttp()
    Console.log(`HTTP: ${http}ms`)
    const ws = await pingWs()
    Console.log(`WS: ${ws}ms`)
  },

  resetcvars() {
    Console.resetCvars()
  },

  set(args) {
    const [cvar, value] = args.split(' ')
    if (!cvar || !value) {
      Console.log('Usage: set <cvar> <value>')
      return
    }
    Console.set(cvar, value)
  },
}

async function pingHttp(): Promise<number> {
  const now = Date.now()
  await NestApi.getStatus()
  return Date.now() - now
}

async function pingWs(): Promise<number> {
  return new Promise((resolve, reject) => {
    const apiUrl = Console.getCvarValue(SystemCvars.SvApiUrl)
    const socket = io(`${apiUrl}`)

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
