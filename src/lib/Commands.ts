const cmdlist: Record<string, () => void> = {}

export function setCommand(command: string, func: () => void) {
  cmdlist[command] = func
}

export function runCommand(command: string) {
  cmdlist[command]?.()
}
