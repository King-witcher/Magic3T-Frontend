import { NestApi } from '@/services'
import { CommandHandler, Console } from './console'
import { io } from 'socket.io-client'

export enum InitialCvars {
  ApiUrl = 'apiurl',
  ConStyle = 'con_style',
  PugMode = 'pugmode',
  StatusPoll = 'statuspoll',
  ThreeTMode = '3tmode',
}

export enum ConStyle {
  Default = '0',
  Q3 = '1',
}

export const initialCvars: Record<string, string> = {
  [InitialCvars.ApiUrl]: import.meta.env.VITE_API_URL,
  [InitialCvars.ConStyle]: ConStyle.Default,
  [InitialCvars.PugMode]: '0',
  [InitialCvars.StatusPoll]: '5000',
  [InitialCvars.ThreeTMode]: '0',
}

export const initialCmds: Record<string, CommandHandler> = {
  clear() {
    Console.clear()
  },

  cmdlist() {
    Console.cmdlist()
  },

  cvarlist() {
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
    Console.log(`Set ${cvar} to ${value}`)
  },
}

async function pingHttp(): Promise<number> {
  const now = Date.now()
  await NestApi.getStatus()
  return Date.now() - now
}

async function pingWs(): Promise<number> {
  return new Promise((resolve, reject) => {
    const socket = io(`${Console.cvars.apiurl}`)

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
