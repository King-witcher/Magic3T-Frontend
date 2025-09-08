import * as MatchController from './match'
import * as QueueController from './queue'
import * as RootController from './root'
import * as UserController from './user'

export namespace NestApi {
  export namespace User {
    export const getById = UserController.getById
    export const getByNickname = UserController.getByNickname
    export const getIcons = UserController.getIcons
    export const getRanking = UserController.getRanking
    export const register = UserController.register
    export const updateIcon = UserController.updateIcon
    export const updateNickname = UserController.updateNickname
  }

  export namespace Match {
    export const getCurrentMatch = MatchController.getCurrentMatch
    export const getMatchesByUser = MatchController.getMatchesByUser
  }

  export namespace Queue {
    export const dequeue = QueueController.dequeue
    export const enqueue = QueueController.enqueue
  }

  export const getStatus = RootController.getStatus
}
