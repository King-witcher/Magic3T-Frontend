import { Console } from '@/lib/console'
import { Cvars } from '@/lib/console/initials'
import axios from 'axios'

const controller = () => {
  return axios.create({
    baseURL: Console.cvars[Cvars.SvApiUrl],
  })
}

type GetStatusResopnse = {
  status: 'available'
}

export async function getStatus(): Promise<GetStatusResopnse> {
  const response = await controller().get('/status')
  return response.data
}
