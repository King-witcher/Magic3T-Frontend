import { useConsole } from '@/components/organisms'
import { useAuth } from '@/contexts/auth.context'
import {
  EventNames,
  EventParams,
  EventsMap,
} from '@socket.io/component-emitter'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Socket, io } from 'socket.io-client'

export type Gateway<
  ServerEvents extends EventsMap,
  ClientEvents extends EventsMap,
> = {
  readonly name: string
  readonly socket: Socket<ServerEvents, ClientEvents> | null
  emit<Ev extends EventNames<ClientEvents>>(
    event: Ev,
    ...data: EventParams<ClientEvents, Ev>
  ): void
}

export function useGateway<
  ServerEvents extends EventsMap,
  ClientEvents extends EventsMap,
>(gateway: string, enabled = true): Gateway<ServerEvents, ClientEvents> {
  const [socket, setSocket] = useState<Socket<
    ServerEvents,
    ClientEvents
  > | null>(null)
  const auth = useAuth()
  const { log } = useConsole()

  useEffect(() => {
    if (!enabled) {
      return
    }

    let cancel = false
    let socket: Socket | null = null
    log(`Connecting to gateway ${gateway}...`)
    auth.getToken().then((token) => {
      if (cancel) return
      socket = io(`${import.meta.env.VITE_API_URL}/${gateway}`, {
        auth: {
          token,
        },
      })
      log(`Connected to gateway ${gateway}.`)

      setSocket(socket)
    })

    return () => {
      cancel = true
      socket?.disconnect()
      setSocket(null)
    }
  }, [gateway, enabled, auth.user?.id, auth.getToken])

  const emit = useCallback(
    <Ev extends EventNames<ClientEvents>>(
      event: Ev,
      ...data: EventParams<ClientEvents, Ev>
    ): void => {
      if (!socket) {
        console.warn(
          `Socket for "${gateway}" gateway is disabled and event "${event.toString()}" will not be sent.`
        )
        log(
          `Socket for "${gateway}" gateway is disabled and event "${event.toString()}" will not be sent.`
        )
        return
      }

      socket.emit(event, ...data)
    },
    [socket]
  )

  return useMemo(
    () => ({
      name: gateway,
      socket,
      emit,
    }),
    [gateway, socket, emit]
  )
}
