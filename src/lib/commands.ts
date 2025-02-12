const cmdlist: Record<string, () => void> = {}

export function setCommand(command: string, func: () => void): () => void {
  const uniqueCommand = command.toLowerCase()
  cmdlist[uniqueCommand] = func
  return () => delete cmdlist[uniqueCommand]
}

export function runCommand(command: string) {
  const uniqueCommand = command.toLowerCase()
  cmdlist[uniqueCommand]?.()
}
