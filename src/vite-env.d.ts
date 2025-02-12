/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CDN_URL: string
}

declare global {
  type Result<T, E> = ResultClass<T, E>
  interface Window {
    Ok<T, E>(data: T): ResultClass<T, E>
    Err<T, E>(error: E): ResultClass<T, E>
  }

  namespace NodeJS {
    interface ProcessEnv {
      API: string
    }
  }
}
