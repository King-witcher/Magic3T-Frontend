import { NestApi } from '@/services'
import { CommandHandler, Console } from './console'
import { io } from 'socket.io-client'

export enum InitialCvars {
  ThreeTMode = '3tmode',
  ApiUrl = 'apiurl',
  PugMode = 'pugmode',
  StatusPoll = 'statuspoll',
}

export const initialCvars: Record<string, string> = {
  [InitialCvars.ThreeTMode]: '0',
  [InitialCvars.ApiUrl]: import.meta.env.VITE_API_URL,
  [InitialCvars.PugMode]: '0',
  [InitialCvars.StatusPoll]: '5000',
}

export const initialCmds: Record<string, CommandHandler> = {
  clear() {
    Console.clear()
  },

  cmdlist() {
    const commandsList = Object.keys(initialCmds).sort()
    for (const command of commandsList) {
      Console.log(command)
    }
    Console.log(`Listed ${commandsList.length} commands`)
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

  echo(args) {
    Console.log(args)
  },

  async httpping() {
    Console.log('Pinging...')
    const now = Date.now()

    await NestApi.getStatus()

    const elapsed = Date.now() - now
    Console.log(`HTTP ping: ${elapsed}ms`)
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

  async wsping() {
    Console.log('Pinging...')
    const socket = io(`${Console.cvars.apiurl}`)

    socket.on('connect', () => {
      const timeout = setTimeout(() => {
        socket.disconnect()
      }, 5000)

      const rng = Math.floor(Math.random() * 1000000)

      socket.on('pong', (arg: unknown) => {
        if (arg !== rng) return
        const elapsed = Date.now() - now
        socket.disconnect()
        clearTimeout(timeout)
        Console.log(`WS ping: ${elapsed}ms`)
      })

      const now = Date.now()

      socket.emit('ping', rng)
    })
  },
}
