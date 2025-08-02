import { Console } from '@/lib/console'
import axios from 'axios'

const controller = () => {
  return axios.create({
    baseURL: `${Console.cvars.apiurl}/match`,
  })
}

export async function getCurrentMatch(token: string): Promise<{ id: string }> {
  const response = await controller().get('/match/current', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status !== 200) {
    throw new Error('Failed to fetch current match.')
  }

  return response.data
}
