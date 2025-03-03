import axios from 'axios'

export const NEST_API_URL = import.meta.env.VITE_API_URL

export const NestApiInstance = axios.create({
  baseURL: NEST_API_URL,
})
