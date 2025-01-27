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

    export async function getRanking(): Promise<UserDto[]> {
      const response = await fetch(`${API_URL}/users/ranking`)
      if (response.status !== 200) return []
      const data: UserDto[] = await response.json()
      return data
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
