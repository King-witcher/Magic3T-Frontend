export function compareArrays<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false

  a.forEach((value, index) => {
    if (value !== b[index]) return false
  })

  return true
}
