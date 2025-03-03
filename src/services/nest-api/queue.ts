import { QueueMode } from '@/types/queue'
import { NEST_API_URL } from './api'
import axios from 'axios'

const controller = axios.create({
  baseURL: `${NEST_API_URL}/queue`,
})

export async function enqueue(token: string, queueMode: QueueMode) {
  const response = await controller.post(
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
  const response = await controller.delete('/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
