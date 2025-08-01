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

const epoch = new Date(2000, 7, 31).getTime()
const chars =
  'zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA9876543210'.split('')

export function getDateFromId(id: string): Date {
  let lannaDate = 0

  // Ignores last character as it is a nonce
  for (let i = 0; i < id.length - 1; i++) {
    const char = id[i]
    const index = chars.indexOf(char)
    if (index === -1)
      throw new Error(`Invalid character "${char}" in id string`)
    lannaDate = lannaDate * 62 + index
  }

  return new Date(epoch + lannaDate * 1000)
}
