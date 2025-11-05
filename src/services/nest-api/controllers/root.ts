import { Console } from '@/lib/console'
import { SystemCvars } from '@/lib/console/initials'
import axios from 'axios'

const controller = () => {
  const apiUrl = Console.getCvarValue(SystemCvars.SvApiUrl) as string
  return axios.create({
    baseURL: apiUrl,
  })
}

type GetStatusResponse = {
  status: 'available'
}

export async function getStatus(): Promise<GetStatusResponse> {
  const response = await controller().get('/status')
  return response.data
}
