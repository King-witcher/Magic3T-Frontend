import { Profile } from '@magic3t/types'
import { NEST_API_URL } from '../api'

export async function getById(id: string): Promise<Profile | null> {
  const response = await fetch(`${NEST_API_URL}/users/id/${id}`)
  if (response.status !== 200) return null
  const data: Profile = await response.json()
  return data
}

export async function getByNickname(nickname: string): Promise<Profile | null> {
  const response = await fetch(`${NEST_API_URL}/users/nickname/${nickname}`)
  if (response.status !== 200) return null
  const data: Profile = await response.json()
  return data
}

export async function getRanking(): Promise<Profile[]> {
  const response = await fetch(`${NEST_API_URL}/users/ranking`)
  if (response.status !== 200) return []
  const data: Profile[] = await response.json()
  return data
}

export async function getIcons(token: string): Promise<number[]> {
  const response = await fetch(`${NEST_API_URL}/users/me/icons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (response.status !== 200) return []

  const data: number[] = await response.json()
  return data
}

export async function updateIcon(token: string, icon: number): Promise<void> {
  const response = await fetch(`${NEST_API_URL}/users/me/icon`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      iconId: icon,
    }),
  })

  if (response.status !== 200) {
    throw new Error('Failed to update icon.')
  }
}
