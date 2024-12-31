import { UserDto } from '@/types/dtos/user'
import { ApiUrl as API_URL } from '../api'

export namespace NestApi.User {
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
