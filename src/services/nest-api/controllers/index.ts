import { MatchDto } from '@magic3t/types'
import * as QueueController from './queue'
import * as UserController from './user'
import * as RootController from './root'
import * as MatchController from './match'
import { Console } from '@/lib/console'

export namespace NestApi {
  export namespace User {
    export const getById = UserController.getById
    export const getByNickname = UserController.getByNickname
    export const getIcons = UserController.getIcons
    export const getRanking = UserController.getRanking
    export const updateIcon = UserController.updateIcon
    export const updateNickname = UserController.updateNickname
  }

  export namespace Match {
    export async function getMatchesByUser(
      userId: string,
      limit: number
    ): Promise<MatchDto[]> {
      const searchParams = new URLSearchParams([['limit', String(limit)]])
      const response = await fetch(
        `${Console.cvars.apiurl}/matches/user/${userId}?${searchParams}`
      )
      const body: MatchDto[] = await response.json()
      return body
    }

    export const getCurrentMatch = MatchController.getCurrentMatch
  }

  export namespace Queue {
    export const enqueue = QueueController.enqueue
    export const dequeue = QueueController.dequeue
  }

  export const getStatus = RootController.getStatus
}
