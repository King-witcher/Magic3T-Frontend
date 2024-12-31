import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

export const Api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true,
})

export namespace SessionRequests {
  type validateSessionResponse = {
    authenticated: boolean
  }
  export async function validateSession(token: string) {
    return await Api.get<validateSessionResponse>(`session/${token}`)
  }
}
