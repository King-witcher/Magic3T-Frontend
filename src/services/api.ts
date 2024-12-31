import axios from 'axios'

export const ApiUrl = import.meta.env.VITE_API_URL

export const Api = axios.create({
  baseURL: ApiUrl,
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
