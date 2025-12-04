export function parse(line: string): { command: string; args: string[] } {
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
    command: args.shift() ?? '',
    args,
  }
}
