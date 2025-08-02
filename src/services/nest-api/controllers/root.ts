import { Console } from '@/lib/console'
import axios from 'axios'

const controller = () => {
  return axios.create({
    baseURL: `${Console.cvars.apiurl}`,
  })
}

type GetStatusResopnse = {
  status: 'available'
}

export async function getStatus(): Promise<GetStatusResopnse> {
  const response = await controller().get('/status')
  return response.data
}
