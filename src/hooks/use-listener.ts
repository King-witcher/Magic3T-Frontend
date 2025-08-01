import { useConsole } from '@/components/organisms'
import {
  EventsMap,
  ReservedOrUserEventNames,
  ReservedOrUserListener,
} from '@socket.io/component-emitter'
import { DependencyList, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Gateway } from './use-gateway'

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
  const { log } = useConsole()

  // Listener is purposely not a dependency of this useEffect since it provides a dependency list.
  useEffect(() => {
    if (!gateway.socket) return
    log(`Subscribed to ${gateway.name}/${event.toString()}`)
    const socket = gateway.socket
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    socket.on(event, <any>listener)
    return () => {
      log(`Unsubscribed from ${gateway.name}/${event.toString()}`)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.off(event, <any>listener)
    }
  }, [gateway, event, ...deps])
}
