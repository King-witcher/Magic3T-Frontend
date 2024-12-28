import {
  EventNames,
  EventsMap,
  ReservedOrUserEventNames,
  ReservedOrUserListener,
} from '@socket.io/component-emitter'
import { Gateway } from './use-gateway'
import { DependencyList, useEffect } from 'react'
import { Socket } from 'socket.io-client'

export type DisconnectDescription =
  | Error
  | {
      description: string
      context?: unknown
    }

interface SocketReservedEvents {
  connect: () => void
  connect_error: (err: Error) => void
  disconnect: (
    reason: Socket.DisconnectReason,
    description?: DisconnectDescription
  ) => void
}

type EventFrom<S extends Socket> = S extends Socket<infer T>
  ? EventNames<T>
  : unknown

export function useListener<
  ServerEventsMap extends EventsMap,
  ClientEventsMap extends EventsMap,
  Ev extends ReservedOrUserEventNames<SocketReservedEvents, ServerEventsMap>,
>(
  gateway: Gateway<ServerEventsMap, ClientEventsMap>,
  event: Ev,
  listener: ReservedOrUserListener<SocketReservedEvents, ServerEventsMap, Ev>,
  deps: DependencyList = []
) {
  // Listener is purposely not a dependency of this useEffect since it provides a dependency list.
  useEffect(() => {
    if (!gateway.socket) return
    console.log(`subscribe to ${gateway.name}/${event.toString()}`)
    const socket = gateway.socket
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    socket.on(event, <any>listener)
    return () => {
      console.log(`unsubscribe from ${gateway.name}/${event.toString()}`)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.off(event, <any>listener)
    }
  }, [gateway, event, ...deps])
}
