import { useAuth } from '@/contexts/auth.context'
import { Console, SystemCvars } from '@/lib/console'
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
  const apiurl = Console.useCvar(SystemCvars.SvApiUrl)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let cancel = false
    let socket: Socket | null = null
    Console.log(`Connecting to gateway ${gateway}...`)
    auth.getToken().then((token) => {
      if (cancel) return
      socket = io(`${apiurl}/${gateway}`, {
        auth: {
          token,
        },
      })
      Console.log(`Connected to gateway '${gateway}'`)

      setSocket(socket)
    })

    return () => {
      cancel = true
      socket?.disconnect()
      setSocket(null)
    }
  }, [gateway, enabled, auth.user?.id, auth.getToken, apiurl])

  const emit = useCallback(
    <Ev extends EventNames<ClientEvents>>(
      event: Ev,
      ...data: EventParams<ClientEvents, Ev>
    ): void => {
      if (!socket) {
        console.warn(
          `Socket for "${gateway}" gateway is disabled and event "${event.toString()}" will not be sent.`
        )
        Console.log(
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
