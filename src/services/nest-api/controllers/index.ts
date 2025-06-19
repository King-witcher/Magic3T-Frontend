import { API_URL } from '@/services/api'
import { MatchDto } from '../dtos'
import * as QueueController from './queue'
import * as UserController from './user'

export namespace NestApi {
  export namespace User {
    export const getById = UserController.getById
    export const getByNickname = UserController.getByNickname
    export const getIcons = UserController.getIcons
    export const getRanking = UserController.getRanking
    export const updateIcon = UserController.updateIcon
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

  export namespace Queue {
    export const enqueue = QueueController.enqueue
    export const dequeue = QueueController.dequeue
  }
}
