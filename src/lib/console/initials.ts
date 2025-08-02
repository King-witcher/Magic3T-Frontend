import { CommandHandler, Console } from './console'

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

  resetcvars() {
    Console.resetCvars()
  },

  cmdlist() {
    const commandsList = Object.keys(initialCmds).sort()
    for (const command of commandsList) {
      Console.log(command)
    }
    Console.log(`Listed ${commandsList.length} commands`)
  },
}
