import { QueueMode } from '@/types/queue'
import axios from 'axios'
import { Console } from '@/lib/console'
import { Cvars } from '@/lib/console/initials'

const controller = () => {
  return axios.create({
    baseURL: `${Console.cvars[Cvars.SvApiUrl]}/queue`,
  })
}

export async function enqueue(token: string, queueMode: QueueMode) {
  const response = await controller().post(
    '/',
    { queueMode },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

export async function dequeue(token: string) {
  const response = await controller().delete('/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
