const months = [
  'Jan.',
  'Fev.',
  'Mar.',
  'Abr.',
  'Mai.',
  'Jun.',
  'Jul.',
  'Ago.',
  'Set.',
  'Out.',
  'Nov.',
  'Dez.',
]

export function formatDate(date: Date): string {
  return `${date.getDate()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()}`
}
