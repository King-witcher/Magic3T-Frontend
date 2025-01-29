const cmdlist: Record<string, () => void> = {}

export function setCommand(command: string, func: () => void): () => void {
  cmdlist[command] = func
  return () => delete cmdlist[command]
}

export function runCommand(command: string) {
  cmdlist[command]?.()
}
