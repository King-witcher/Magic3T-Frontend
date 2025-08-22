import { Console } from '@/lib/console'
import { Cvars } from '@/lib/console/initials'
import { GetMatchesResult } from '@magic3t/types'
import axios from 'axios'

const controller = () => {
  return axios.create({
    baseURL: `${Console.cvars[Cvars.SvApiUrl]}/matches`,
  })
}

export async function getCurrentMatch(token: string): Promise<{ id: string }> {
  const response = await controller().get('/current', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status !== 200) {
    throw new Error('Failed to fetch current match.')
  }

  return response.data
}

export async function getMatchesByUser(
  userId: string,
  limit: number
): Promise<GetMatchesResult> {
  const response = await controller().get(`/user/${userId}`, {
    params: {
      limit,
    },
  })
  return response.data
}
