export function compareArrays<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false

  a.forEach((value, index) => {
    if (value !== b[index]) return false
  })

  return true
}

export function formatTime(timeMs: number): string {
  const timeSecs = (timeMs / 1000) % 60
  const timeMins = timeMs / 60_000

  if (timeMs > 10_000) {
    return `${Math.floor(timeMins)}:${Math.floor(timeSecs)
      .toFixed()
      .padStart(2, '0')}`
  }
  return `${timeSecs.toFixed(1)}`
}
