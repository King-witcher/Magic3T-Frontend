import { Console } from '@/lib/console'
import { Cvars } from '@/lib/console/initials'
import { RegisterUserCommand, UserPayload } from '@magic3t/types'
import axios from 'axios'

const controller = () =>
  axios.create({
    baseURL: new URL('users', Console.cvars[Cvars.SvApiUrl]).toString(),
  })

export async function getById(id: string): Promise<UserPayload | null> {
  const response = await fetch(
    `${Console.cvars[Cvars.SvApiUrl]}/users/id/${id}`
  )
  if (response.status !== 200) return null
  const data: UserPayload = await response.json()
  return data
}

export async function getByNickname(
  nickname: string
): Promise<UserPayload | null> {
  const response = await fetch(
    `${Console.cvars[Cvars.SvApiUrl]}/users/nickname/${nickname}`
  )
  if (response.status !== 200) return null
  const data: UserPayload = await response.json()
  return data
}

export async function getRanking(): Promise<UserPayload[]> {
  const response = await fetch(`${Console.cvars[Cvars.SvApiUrl]}/users/ranking`)
  if (response.status !== 200) return []
  const data: UserPayload[] = await response.json()
  return data
}

export async function getIcons(token: string): Promise<number[]> {
  const response = await fetch(
    `${Console.cvars[Cvars.SvApiUrl]}/users/me/icons`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (response.status !== 200) return []

  const data: number[] = await response.json()
  return data
}

export async function register(token: string, data: RegisterUserCommand) {
  const response = await controller().post('/register', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status !== 201) {
    throw new Error('Failed to register user.')
  }
}

export async function updateIcon(token: string, icon: number): Promise<void> {
  const response = await fetch(
    `${Console.cvars[Cvars.SvApiUrl]}/users/me/icon`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        iconId: icon,
      }),
    }
  )

  if (response.status !== 200) {
    throw new Error('Failed to update icon.')
  }
}

export async function updateNickname(
  token: string,
  nickname: string
): Promise<void> {
  const response = await fetch(
    `${Console.cvars[Cvars.SvApiUrl]}/users/me/nickname`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        nickname,
      }),
    }
  )

  if (response.status !== 200) {
    throw new Error('Failed to update nickname.')
  }
}
