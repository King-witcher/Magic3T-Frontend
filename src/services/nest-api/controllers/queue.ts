import { Console, SystemCvars } from '@/lib/console'
import { QueueMode } from '@/types/queue'
import axios from 'axios'

const controller = () => {
  const apiUrl = Console.getCvarValue(SystemCvars.SvApiUrl)
  return axios.create({
    baseURL: `${apiUrl}/queue`,
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
