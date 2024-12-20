export function getIconUrl(iconId?: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/11.14.1/img/profileicon/${iconId ?? 29}.png`
}

export function block<T>(callback: () => T) {
  return callback()
}
