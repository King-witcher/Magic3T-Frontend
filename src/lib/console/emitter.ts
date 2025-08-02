import { Observable } from '../observable'

interface ConsoleEventsMap {
  changeCvar: (cvar: string) => void
  changeBuffer: () => void
}

export class PublicEmitter extends Observable<ConsoleEventsMap> {
  public publicEmit<Event extends keyof ConsoleEventsMap>(
    event: Event,
    ...data: Parameters<ConsoleEventsMap[Event]>
  ) {
    this.emit(event, ...data)
  }
}
