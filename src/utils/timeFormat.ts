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

// Chat gptzada xD
export function formatMinutes(timestamp: number) {
  // Cria um objeto Date usando o timestamp
  const date = new Date(timestamp)
  const hours = date.getHours()
  const mins = date.getMinutes()

  // Cria a string formatada
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

// Função auxiliar para adicionar zero à esquerda se necessário
function adicionarZero(numero: number) {
  return numero < 10 ? '0' + numero : numero
}
