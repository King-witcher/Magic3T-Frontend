import axios from 'axios'

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  validateStatus: () => true,
})

export module SessionRequests {
  type validateSessionResponse = {
    authenticated: boolean
  }
  export async function validateSession(token: string) {
    return await Api.get<validateSessionResponse>(`session/${token}`)
  }
}
