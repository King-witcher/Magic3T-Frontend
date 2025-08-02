// biome-ignore lint/suspicious/noExplicitAny: xD
type EventsMap = Record<string | number, any>

type EventNames<Map extends EventsMap> = keyof Map

type EventParams<
  Map extends EventsMap,
  Event extends EventNames<Map>,
> = Parameters<Map[Event]>

export type Observer<Map extends EventsMap, Event extends EventNames<Map>> = (
  ...data: EventParams<Map, Event>
) => void

type ObserverMap<Map extends EventsMap> = {
  [Event in EventNames<Map>]?: Observer<Map, Event>[]
}

export interface IObservable<ObservableEventsMap extends EventsMap> {
  onMany<Event extends EventNames<ObservableEventsMap>>(
    events: Event[],
    observer: Observer<ObservableEventsMap, Event>
  ): () => void

  on<Event extends EventNames<ObservableEventsMap>>(
    event: Event,
    observer: Observer<ObservableEventsMap, Event>
  ): () => void
}

export abstract class Observable<ObservableEventsMap extends EventsMap>
  implements IObservable<ObservableEventsMap>
{
  private observers: ObserverMap<ObservableEventsMap> = {}

  public onMany<Event extends keyof ObservableEventsMap>(
    events: Event[],
    observer: Observer<ObservableEventsMap, Event>
  ) {
    for (const event of events) {
      this.on(event, observer)
    }

    return () => {
      for (const event of events) {
        this.observers[event] = this.observers[event]?.filter(
          (obs) => obs !== observer
        )
      }
    }
  }

  public on<Event extends EventNames<ObservableEventsMap>>(
    events: Event,
    observer: Observer<ObservableEventsMap, Event>
  ) {
    this.observers[events] = [...(this.observers[events] || []), observer]

    return () => {
      this.observers[events] = this.observers[events]?.filter(
        (obs) => obs !== observer
      )
    }
  }

  protected emit<Event extends EventNames<ObservableEventsMap>>(
    event: Event,
    ...data: EventParams<ObservableEventsMap, Event>
  ) {
    if (this.observers[event])
      for (const observer of this.observers[event]) observer(...data)
  }
}
