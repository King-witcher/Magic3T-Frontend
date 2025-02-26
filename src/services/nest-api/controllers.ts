import { API_URL } from '../api'
import { MatchDto, UserDto } from './dtos'

export namespace NestApi {
  export namespace User {
    export async function getById(id: string): Promise<UserDto | null> {
      const response = await fetch(`${API_URL}/users/id/${id}`)
      if (response.status !== 200) return null
      const data: UserDto = await response.json()
      return data
    }

    export async function getByNickname(
      nickname: string
    ): Promise<UserDto | null> {
      const response = await fetch(`${API_URL}/users/nickname/${nickname}`)
      if (response.status !== 200) return null
      const data: UserDto = await response.json()
      return data
    }

    export async function getRanking(): Promise<UserDto[]> {
      const response = await fetch(`${API_URL}/users/ranking`)
      if (response.status !== 200) return []
      const data: UserDto[] = await response.json()
      return data
    }

    export async function getIcons(token: string): Promise<number[]> {
      const response = await fetch(`${API_URL}/users/me/icons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 200) return []

      const data: number[] = await response.json()
      return data
    }

    export async function updateIcon(
      token: string,
      icon: number
    ): Promise<void> {
      const response = await fetch(`${API_URL}/users/me/icon`, {
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
  }

  export namespace Match {
    export async function getMatchesByUser(
      userId: string,
      limit: number
    ): Promise<MatchDto[]> {
      const searchParams = new URLSearchParams([['limit', String(limit)]])
      const response = await fetch(
        `${API_URL}/matches/user/${userId}?${searchParams}`
      )
      const body: MatchDto[] = await response.json()
      return body
    }
  }
}
